import { desc } from "drizzle-orm"
import { getDatabase } from "../storage/database/connection"
import { type RawThought, rawThoughts } from "./schema"

function listRawThoughts({
    limit = 50
}: {
    limit?: number
} = {}): Promise<RawThought[]> {
    return getDatabase()
        .select()
        .from(rawThoughts)
        .orderBy(desc(rawThoughts.createdAt))
        .limit(limit)
}

export { listRawThoughts }
