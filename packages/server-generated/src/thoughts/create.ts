import { getDatabase } from "../storage/database/connection"
import { type RawThought, rawThoughts } from "./schema"

async function createRawThought({
    content
}: {
    content: string
}): Promise<RawThought> {
    const [thought] = await getDatabase()
        .insert(rawThoughts)
        .values({ content })
        .returning()

    if (!thought) throw new Error("Failed to create raw thought.")

    return thought
}

export { createRawThought }
