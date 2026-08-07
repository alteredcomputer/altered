import { getDatabase } from "../storage/database/connection"
import { type RawThought, rawThoughts } from "./schema"

function createRawThoughtsMany({
    contents
}: {
    contents: string[]
}): Promise<RawThought[]> {
    if (contents.length === 0) return Promise.resolve([])

    return getDatabase()
        .insert(rawThoughts)
        .values(contents.map(content => ({ content })))
        .returning()
}

export { createRawThoughtsMany }
