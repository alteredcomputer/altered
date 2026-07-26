import { and, eq, inArray } from "drizzle-orm"
import { getDatabase } from "../../storage/database/connection"
import { backlinks } from "../backlinks/storage/schema"
import { thoughts } from "./storage/schema"

/**
 * Deletes derived thoughts that backlink to a chat message.
 *
 * @remarks Cascades remove backlinks, tags, and dataset membership.
 */
const deleteDerivedThoughtsForChatMessage = async (
    messageId: string
): Promise<number> => {
    const database = getDatabase()

    const rows = await database
        .select({ thoughtId: backlinks.thoughtId })
        .from(backlinks)
        .where(
            and(
                eq(backlinks.sourceType, "chat-message"),
                eq(backlinks.sourceId, messageId)
            )
        )

    const thoughtIds = [...new Set(rows.map(row => row.thoughtId))]

    if (thoughtIds.length === 0) return 0

    await database.delete(thoughts).where(inArray(thoughts.id, thoughtIds))

    return thoughtIds.length
}

export { deleteDerivedThoughtsForChatMessage }
