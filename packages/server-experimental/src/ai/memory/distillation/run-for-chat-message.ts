import type { LanguageModelID } from "@altered/core-experimental/config/ai"
import { eq } from "drizzle-orm"
import { chatMessages } from "../../../chat/messages/schema"
import { toPlainText } from "../../../chat/messages/to-plain-text"
import { startDistillationAgentRun } from "../../../models/agent-runs/save-distillation"
import { getDatabase } from "../../../storage/database/connection"
import type {
    CollectedThought,
    DistillationSource
} from "../../agents/chat/subagents/distillation/context"
import { DEFAULT_DISTILLATION_MODEL_ID } from "../../agents/chat/subagents/distillation/definition"
import { splitSourceIntoChunks } from "../../agents/chat/subagents/distillation/source/split"
import { createAgentForMessage, toAuthor } from "./create-agent-for-message"
import { failDistillationRun, finalizeDistillationRun } from "./finalize-run"
import { runDistillationChunks } from "./run-chunks"
import { createUsageTotals } from "./usage"

type DistillChatMessageOptions = {
    messageId: string
    modelId?: LanguageModelID
    maxChunks?: number
    persist?: boolean
    indexKeywords?: boolean
    batchId?: string | null
    debug?: { thinking?: boolean }
    log?: boolean
}

type DistillChatMessageResult = {
    agentRunId: string | null
    thoughtIds: string[]
    thoughtCount: number
    stepCount: number
    cost: number
    logPath: string
}

const loadChatMessage = async (messageId: string) => {
    const database = getDatabase()

    const [message] = await database
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.id, messageId))
        .limit(1)

    if (!message) throw new Error(`Chat message not found: ${messageId}`)

    return message
}

/**
 * Distill one persisted chat message into derived thoughts.
 *
 * @remarks Production path for on-save scheduling. `tmp-distill-poc` remains the
 * CLI / batch entrypoint and should call this.
 */
const distillChatMessage = async (
    options: DistillChatMessageOptions
): Promise<DistillChatMessageResult> => {
    const startedAt = new Date()
    const shouldPersist = options.persist ?? true
    const shouldIndex = options.indexKeywords ?? false
    const shouldLog = options.log ?? false

    if (shouldIndex && !shouldPersist)
        throw new Error("indexKeywords requires persist.")

    const message = await loadChatMessage(options.messageId)
    const sourceText = toPlainText(message.content)

    if (sourceText.trim().length === 0)
        throw new Error(`Chat message ${message.id} has no text to distill.`)

    const sourceZero: DistillationSource = {
        index: 0,
        id: message.id,
        author: toAuthor(message.role),
        text: sourceText,
        chunks: splitSourceIntoChunks(sourceText)
    }

    const loadedSources: DistillationSource[] = [sourceZero]
    const collectedThoughts: CollectedThought[] = []
    const modelId = options.modelId ?? DEFAULT_DISTILLATION_MODEL_ID

    const agentRun = shouldPersist
        ? await startDistillationAgentRun({
              model: modelId,
              conversationId: message.conversationId,
              chatMessageId: message.id,
              batchId: options.batchId
          })
        : null

    const agent = createAgentForMessage({
        message,
        modelId,
        debug: options.debug
    })

    if (shouldLog)
        console.log(
            `[distill] message ${message.id} (${message.role}) - ${sourceText.length} chars, ${sourceZero.chunks.length} chunks on ${modelId}${shouldPersist ? " (persist)" : ""}`
        )

    const totals = createUsageTotals()
    let savedThoughtIds: string[] = []

    try {
        const { chunkLogs, stepCount } = await runDistillationChunks({
            agent,
            source: sourceZero,
            loadedSources,
            collectedThoughts,
            maxChunks: options.maxChunks,
            log: shouldLog,
            totals
        })

        const finalized = await finalizeDistillationRun({
            startedAt,
            modelId,
            agentRunId: agentRun?.id ?? null,
            sources: loadedSources,
            thoughts: collectedThoughts,
            chunkLogs,
            stepCount,
            totals,
            persist: shouldPersist,
            indexKeywords: shouldIndex,
            log: shouldLog
        })

        savedThoughtIds = finalized.thoughtIds

        return {
            agentRunId: agentRun?.id ?? null,
            thoughtIds: savedThoughtIds,
            thoughtCount: collectedThoughts.length,
            stepCount,
            cost: totals.cost,
            logPath: finalized.logPath
        }
    } catch (error) {
        await failDistillationRun({
            agentRunId: agentRun?.id ?? null,
            thoughtIds: savedThoughtIds,
            totals,
            error
        })

        throw error
    }
}

export {
    type DistillChatMessageOptions,
    type DistillChatMessageResult,
    distillChatMessage
}
