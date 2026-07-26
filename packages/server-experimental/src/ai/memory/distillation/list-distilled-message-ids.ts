import { and, eq, isNotNull } from "drizzle-orm"
import { agentRuns } from "../../../models/agent-runs/storage/schema"
import { getDatabase } from "../../../storage/database/connection"

/**
 * Chat message ids in a conversation that already have a succeeded distillation run.
 */
const listDistilledChatMessageIds = async (
    conversationId: string
): Promise<Set<string>> => {
    const database = getDatabase()

    const rows = await database
        .select({ chatMessageId: agentRuns.chatMessageId })
        .from(agentRuns)
        .where(
            and(
                eq(agentRuns.type, "distillation"),
                eq(agentRuns.status, "succeeded"),
                eq(agentRuns.conversationId, conversationId),
                isNotNull(agentRuns.chatMessageId)
            )
        )

    return new Set(
        rows
            .map(row => row.chatMessageId)
            .filter((id): id is string => typeof id === "string")
    )
}

export { listDistilledChatMessageIds }
