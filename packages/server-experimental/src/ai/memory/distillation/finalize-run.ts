import { completeDistillationAgentRun } from "../../../models/agent-runs/save-distillation"
import type {
    CollectedThought,
    DistillationSource
} from "../../agents/chat/subagents/distillation/context"
import { distillationAgentId } from "../../agents/chat/subagents/distillation/definition"
import { readBacklink } from "../../agents/chat/subagents/distillation/source/read-backlink"
import { writeAgentRunLog } from "../../observability/write-run-log"
import { indexThoughtIds, persistCollectedThoughts } from "./persist-thoughts"
import { formatUsageCost, type UsageTotals } from "./usage"

type FinalizeDistillationRunOptions = {
    startedAt: Date
    modelId: string
    agentRunId: string | null
    sources: DistillationSource[]
    thoughts: CollectedThought[]
    chunkLogs: unknown[]
    stepCount: number
    totals: UsageTotals
    persist: boolean
    indexKeywords: boolean
    log: boolean
}

type FinalizeDistillationRunResult = {
    thoughtIds: string[]
    logPath: string
}

const finalizeDistillationRun = async (
    options: FinalizeDistillationRunOptions
): Promise<FinalizeDistillationRunResult> => {
    const savedThoughtIds = options.persist
        ? await persistCollectedThoughts(options.sources, options.thoughts)
        : []

    const indexedKeywords = options.indexKeywords
        ? await indexThoughtIds(savedThoughtIds)
        : {}

    if (options.agentRunId)
        await completeDistillationAgentRun({
            id: options.agentRunId,
            status: "succeeded",
            resultThoughtIds: savedThoughtIds,
            cost: options.totals.cost,
            inputTokens: options.totals.inputTokens,
            outputTokens: options.totals.outputTokens,
            totalTokens: options.totals.totalTokens
        })

    const logPath = await writeAgentRunLog({
        agentId: distillationAgentId,
        startedAt: options.startedAt,

        data: {
            agentId: distillationAgentId,
            createdAt: options.startedAt.toISOString(),
            modelId: options.modelId,
            agentRunId: options.agentRunId,
            persistedThoughtIds: savedThoughtIds,
            indexedKeywords,

            sources: options.sources.map(source => ({
                index: source.index,
                id: source.id,
                author: source.author,
                text: source.text,
                chunkCount: source.chunks.length
            })),

            chunks: options.chunkLogs,

            thoughts: options.thoughts.map(thought => ({
                content: thought.content,
                thinking: thought.thinking,
                backlinks: thought.backlinks.map(backlink =>
                    readBacklink(options.sources, backlink)
                )
            })),

            summary: {
                thoughtCount: options.thoughts.length,
                stepCount: options.stepCount,
                cost: formatUsageCost(options.totals)
            }
        }
    })

    if (options.log) {
        console.log(
            `\n[distill] ${options.thoughts.length} thoughts, ${options.stepCount} steps, ${formatUsageCost(options.totals)}${options.persist ? `, saved ${savedThoughtIds.length}` : ""}`
        )
        if (options.agentRunId)
            console.log(`[distill] Agent run: ${options.agentRunId}`)
        console.log(`[distill] Log file: file://${logPath}`)
    }

    return { thoughtIds: savedThoughtIds, logPath }
}

const failDistillationRun = async (options: {
    agentRunId: string | null
    thoughtIds: string[]
    totals: UsageTotals
    error: unknown
}): Promise<void> => {
    if (!options.agentRunId) return

    await completeDistillationAgentRun({
        id: options.agentRunId,
        status: "failed",
        resultThoughtIds: options.thoughtIds,
        cost: options.totals.cost,
        inputTokens: options.totals.inputTokens,
        outputTokens: options.totals.outputTokens,
        totalTokens: options.totals.totalTokens,
        error:
            options.error instanceof Error
                ? options.error.message
                : String(options.error)
    })
}

export { failDistillationRun, finalizeDistillationRun }
