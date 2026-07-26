import { eq } from "drizzle-orm"
import {
    type KeywordPipelineOptions,
    type KeywordPipelineResult,
    runKeywordPipeline
} from "../../ai/memory/keywords/pipeline"
import { getDatabase } from "../../storage/database/connection"
import { replaceTagsForThought } from "../tags/replace-for-thought"
import { thoughts } from "./storage/schema"

/**
 * Runs the shared keyword pipeline for one thought and replaces its tags.
 */
const indexThoughtKeywords = async (
    thoughtId: string,
    options: KeywordPipelineOptions = {}
): Promise<KeywordPipelineResult> => {
    const database = getDatabase()

    const [thought] = await database
        .select()
        .from(thoughts)
        .where(eq(thoughts.id, thoughtId))
        .limit(1)

    if (!thought) throw new Error(`Thought not found: ${thoughtId}`)

    if (!thought.content?.trim())
        throw new Error(`Thought ${thoughtId} has no content to index.`)

    const result = await runKeywordPipeline(thought.content, options)

    await replaceTagsForThought(thoughtId, result.keywords)

    return result
}

export { indexThoughtKeywords }
