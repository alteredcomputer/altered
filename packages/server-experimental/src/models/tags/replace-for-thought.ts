import { eq } from "drizzle-orm"
import { getDatabase } from "../../storage/database/connection"
import { type Tag, tags } from "./storage/schema"

/**
 * Replaces all tags on a thought with the given keywords (deduped by unique index).
 */
const replaceTagsForThought = (
    thoughtId: string,
    keywords: string[]
): Promise<Tag[]> => {
    const database = getDatabase()

    const uniqueKeywords = [
        ...new Set(keywords.map(keyword => keyword.trim()))
    ].filter(Boolean)

    return database.transaction(async tx => {
        await tx.delete(tags).where(eq(tags.thoughtId, thoughtId))

        if (uniqueKeywords.length === 0) return []

        return tx
            .insert(tags)
            .values(
                uniqueKeywords.map(keyword => ({
                    thoughtId,
                    keyword
                }))
            )
            .returning()
    })
}

export { replaceTagsForThought }
