import { eq } from "drizzle-orm"
import { getDatabase } from "../../storage/database/connection"
import { type AgentRun, agentRuns } from "./storage/schema"

type StartDistillationAgentRunInput = {
    model: string
    conversationId: string
    chatMessageId: string
    batchId?: string | null
}

type CompleteDistillationAgentRunInput = {
    id: string
    status: "succeeded" | "failed"
    resultThoughtIds: string[]
    cost?: number
    inputTokens?: number
    outputTokens?: number
    totalTokens?: number
    error?: string
}

/**
 * Opens a distillation `agent_runs` row in `running` status.
 */
const startDistillationAgentRun = async (
    input: StartDistillationAgentRunInput
): Promise<AgentRun> => {
    const database = getDatabase()

    const [run] = await database
        .insert(agentRuns)
        .values({
            type: "distillation",
            status: "running",
            model: input.model,
            conversationId: input.conversationId,
            chatMessageId: input.chatMessageId,
            batchId: input.batchId ?? null
        })
        .returning()

    if (!run) throw new Error("Failed to start distillation agent run.")

    return run
}

/**
 * Finalizes a distillation run with cost, tokens, and produced thought ids.
 */
const completeDistillationAgentRun = async (
    input: CompleteDistillationAgentRunInput
): Promise<AgentRun> => {
    const database = getDatabase()

    const [run] = await database
        .update(agentRuns)
        .set({
            status: input.status,
            resultThoughtIds: input.resultThoughtIds,
            cost: input.cost === undefined ? null : input.cost.toFixed(6),
            inputTokens: input.inputTokens ?? null,
            outputTokens: input.outputTokens ?? null,
            totalTokens: input.totalTokens ?? null,
            error: input.error ?? null,
            completedAt: new Date()
        })
        .where(eq(agentRuns.id, input.id))
        .returning()

    if (!run) throw new Error("Failed to complete distillation agent run.")

    return run
}

export {
    type CompleteDistillationAgentRunInput,
    completeDistillationAgentRun,
    type StartDistillationAgentRunInput,
    startDistillationAgentRun
}
