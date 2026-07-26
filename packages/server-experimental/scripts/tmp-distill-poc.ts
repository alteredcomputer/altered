/**
 * Scratchpad for the distillation POC. Loads one chat message, chunks it, and
 * runs the distillation subagent sequentially per chunk.
 *
 * @remarks Pass `--persist` to write derived thoughts + an `agent_runs` row.
 * The full trace always goes to `.logs/agents/distillation/runs/`.
 */

import "dotenv/config"

import { parseArgs } from "node:util"
import type { LanguageModelID } from "@altered/core-experimental/config/ai"
import { and, asc, desc, eq, isNull, lt } from "drizzle-orm"
import type {
    CollectedThought,
    DistillationSource
} from "../src/ai/agents/chat/subagents/distillation/context"
import {
    createDistillationAgent,
    DEFAULT_DISTILLATION_MODEL_ID,
    distillationAgentId
} from "../src/ai/agents/chat/subagents/distillation/definition"
import { distillationChatMessageInstructions } from "../src/ai/agents/chat/subagents/distillation/instructions/chat-messages"
import { readBacklink } from "../src/ai/agents/chat/subagents/distillation/source/read-backlink"
import { splitSourceIntoChunks } from "../src/ai/agents/chat/subagents/distillation/source/split"
import { writeAgentRunLog } from "../src/ai/observability/write-run-log"
import {
    formatOpenRouterCost,
    parseOpenrouterProviderMetadata
} from "../src/ai/provider/metadata"
import { type ChatMessage, chatMessages } from "../src/chat/messages/schema"
import {
    completeDistillationAgentRun,
    startDistillationAgentRun
} from "../src/models/agent-runs/save-distillation"
import { saveDerivedThought } from "../src/models/thoughts/save-derived"
import { toPersistedBacklinks } from "../src/models/thoughts/to-persisted-backlinks"
import { getDatabase } from "../src/storage/database/connection"

const { values } = parseArgs({
    options: {
        "message-id": { type: "string" },
        "max-chunks": { type: "string" },
        model: { type: "string" },
        persist: { type: "boolean", default: false }
    }
})

const STARTED_AT = new Date()

type UsageTotals = {
    cost: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
}

const toPlainText = (content: unknown): string => {
    if (typeof content === "string") return content

    if (!Array.isArray(content)) return JSON.stringify(content)

    return content
        .map(part =>
            part &&
            typeof part === "object" &&
            "text" in part &&
            typeof part.text === "string"
                ? part.text
                : ""
        )
        .filter(Boolean)
        .join("\n")
}

const toAuthor = (role: ChatMessage["role"]): "user" | "agent" =>
    role === "assistant" ? "agent" : "user"

const condense = (value: unknown, max = 120): string => {
    const text = JSON.stringify(value) ?? ""

    return text.length > max ? `${text.slice(0, max)}...` : text
}

const loadMessage = async (): Promise<ChatMessage> => {
    const database = getDatabase()

    const [message] = values["message-id"]
        ? await database
              .select()
              .from(chatMessages)
              .where(eq(chatMessages.id, values["message-id"]))
              .limit(1)
        : await database
              .select()
              .from(chatMessages)
              .where(
                  and(
                      eq(chatMessages.role, "user"),
                      isNull(chatMessages.userId)
                  )
              )
              .orderBy(asc(chatMessages.createdAt))
              .limit(1)

    if (!message) throw new Error("No chat message found to distill.")

    return message
}

const summarizeSteps = (
    steps: {
        stepNumber: number
        finishReason: string
        providerMetadata?: Parameters<typeof parseOpenrouterProviderMetadata>[0]
        toolCalls: { toolName: string; input: unknown }[]
        toolResults: { toolName: string; output: unknown }[]
        content: { type: string; toolName?: string; error?: unknown }[]
        text: string
    }[],
    totals: UsageTotals
) =>
    steps.map(step => {
        const usage = parseOpenrouterProviderMetadata(step.providerMetadata)
            ?.openrouter?.usage

        const cost = usage?.cost ?? 0

        totals.cost += cost
        totals.inputTokens += usage?.promptTokens ?? 0
        totals.outputTokens += usage?.completionTokens ?? 0
        totals.totalTokens += usage?.totalTokens ?? 0

        return {
            stepNumber: step.stepNumber,
            finishReason: step.finishReason,

            toolCalls: step.toolCalls.map(call => ({
                toolName: call.toolName,
                input: call.input
            })),

            toolResults: step.toolResults.map(toolResult => ({
                toolName: toolResult.toolName,
                output: toolResult.output
            })),

            toolErrors: step.content
                .filter(part => part.type === "tool-error")
                .map(part => ({
                    toolName: part.toolName ?? "unknown",
                    error: String(part.error)
                })),

            text: step.text,
            cost
        }
    })

const logStepActivity = (
    steps: ReturnType<typeof summarizeSteps>,
    thoughts: CollectedThought[]
) => {
    for (const step of steps) {
        for (const call of step.toolCalls)
            console.log(`  ${call.toolName} ${condense(call.input)}`)

        for (const toolError of step.toolErrors)
            console.log(
                `  ERROR ${toolError.toolName}: ${condense(toolError.error, 200)}`
            )
    }

    for (const thought of thoughts) console.log(`  + ${thought.content}`)
}

const persistCollectedThoughts = async (
    sources: DistillationSource[],
    thoughts: CollectedThought[]
): Promise<string[]> => {
    const savedThoughtIds: string[] = []

    for (const thought of thoughts) {
        const saved = await saveDerivedThought({
            content: thought.content,
            backlinks: toPersistedBacklinks(sources, thought.backlinks)
        })

        savedThoughtIds.push(saved.id)
        console.log(`  saved ${saved.id}`)
    }

    return savedThoughtIds
}

const main = async () => {
    const database = getDatabase()
    const shouldPersist = values.persist === true
    const message = await loadMessage()

    let earliestLoaded = message

    const sourceText = toPlainText(message.content)
    const sourceZero: DistillationSource = {
        index: 0,
        id: message.id,
        author: toAuthor(message.role),
        text: sourceText,
        chunks: splitSourceIntoChunks(sourceText)
    }

    const loadedSources: DistillationSource[] = [sourceZero]
    const collectedThoughts: CollectedThought[] = []

    const modelId = (values.model ??
        DEFAULT_DISTILLATION_MODEL_ID) as LanguageModelID

    const agentRun = shouldPersist
        ? await startDistillationAgentRun({
              model: modelId,
              conversationId: message.conversationId,
              chatMessageId: message.id
          })
        : null

    const agent = createDistillationAgent({
        modelId,

        fetchPreviousSource: async () => {
            const [previous] = await database
                .select()
                .from(chatMessages)
                .where(
                    and(
                        eq(
                            chatMessages.conversationId,
                            earliestLoaded.conversationId
                        ),
                        isNull(chatMessages.userId),
                        lt(chatMessages.createdAt, earliestLoaded.createdAt)
                    )
                )
                .orderBy(desc(chatMessages.createdAt))
                .limit(1)

            if (!previous) return null

            earliestLoaded = previous

            return {
                id: previous.id,
                author: toAuthor(previous.role),
                text: toPlainText(previous.content)
            }
        },

        debug: { thinking: true },
        instructions: { extensions: [distillationChatMessageInstructions] }
    })

    const maxChunks = values["max-chunks"]
        ? Number(values["max-chunks"])
        : sourceZero.chunks.length

    const processedChunks = Math.min(maxChunks, sourceZero.chunks.length)

    console.log(
        `[distill] message ${message.id} (${message.role}) - ${sourceText.length} chars, ${sourceZero.chunks.length} chunks, running ${processedChunks} on ${modelId}${shouldPersist ? " (persist)" : ""}`
    )

    const chunkLogs: unknown[] = []
    const totals: UsageTotals = {
        cost: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0
    }
    let totalSteps = 0
    let savedThoughtIds: string[] = []

    try {
        for (const chunk of sourceZero.chunks.slice(0, processedChunks)) {
            const thoughtCountBefore = collectedThoughts.length

            console.log(
                `\n[chunk ${chunk.index}] ${JSON.stringify(chunk.text)}`
            )

            const result = await agent.generate({
                options: {
                    context: {
                        sources: loadedSources,
                        chunkIndex: chunk.index,
                        collectedThoughts
                    }
                },

                messages: [
                    {
                        role: "system",
                        content: [
                            "Distillation target:",
                            "- Source type: Koa iMessage chat message",
                            `- Source 0 author: ${sourceZero.author}`,
                            `- Chunk ${chunk.index + 1} of ${sourceZero.chunks.length} (index ${chunk.index}, kind: ${chunk.kind})`,
                            `- Chunk spans characters ${chunk.start}-${chunk.end} of source 0`,
                            "The next user message is the exact chunk text, verbatim (it may include leading whitespace)."
                        ].join("\n")
                    },
                    { role: "user", content: chunk.text }
                ]
            })

            const steps = summarizeSteps(result.steps, totals)
            totalSteps += steps.length

            logStepActivity(steps, collectedThoughts.slice(thoughtCountBefore))

            chunkLogs.push({
                index: chunk.index,
                kind: chunk.kind,
                start: chunk.start,
                end: chunk.end,
                text: chunk.text,
                steps,
                recordedThoughtCount:
                    collectedThoughts.length - thoughtCountBefore
            })
        }

        if (shouldPersist)
            savedThoughtIds = await persistCollectedThoughts(
                loadedSources,
                collectedThoughts
            )

        if (agentRun)
            await completeDistillationAgentRun({
                id: agentRun.id,
                status: "succeeded",
                resultThoughtIds: savedThoughtIds,
                cost: totals.cost,
                inputTokens: totals.inputTokens,
                outputTokens: totals.outputTokens,
                totalTokens: totals.totalTokens
            })

        const thoughts = collectedThoughts.map(thought => ({
            content: thought.content,
            thinking: thought.thinking,
            backlinks: thought.backlinks.map(backlink =>
                readBacklink(loadedSources, backlink)
            )
        }))

        const logPath = await writeAgentRunLog({
            agentId: distillationAgentId,
            startedAt: STARTED_AT,

            data: {
                agentId: distillationAgentId,
                createdAt: STARTED_AT.toISOString(),
                modelId,
                agentRunId: agentRun?.id ?? null,
                persistedThoughtIds: savedThoughtIds,

                sources: loadedSources.map(source => ({
                    index: source.index,
                    id: source.id,
                    author: source.author,
                    text: source.text,
                    chunkCount: source.chunks.length
                })),

                chunks: chunkLogs,
                thoughts,

                summary: {
                    thoughtCount: thoughts.length,
                    stepCount: totalSteps,
                    cost: formatOpenRouterCost(totals.cost)
                }
            }
        })

        console.log(
            `\n[distill] ${thoughts.length} thoughts, ${totalSteps} steps, ${formatOpenRouterCost(totals.cost)}${shouldPersist ? `, saved ${savedThoughtIds.length}` : ""}`
        )
        if (agentRun) console.log(`[distill] Agent run: ${agentRun.id}`)
        console.log(`[distill] Log file: file://${logPath}`)
    } catch (error) {
        if (agentRun)
            await completeDistillationAgentRun({
                id: agentRun.id,
                status: "failed",
                resultThoughtIds: savedThoughtIds,
                cost: totals.cost,
                inputTokens: totals.inputTokens,
                outputTokens: totals.outputTokens,
                totalTokens: totals.totalTokens,
                error: error instanceof Error ? error.message : String(error)
            })

        throw error
    }
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
