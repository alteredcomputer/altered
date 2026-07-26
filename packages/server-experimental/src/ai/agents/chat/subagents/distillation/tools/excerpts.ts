import type { Backlink } from "../backlinks"
import type { DistillationAgentContext } from "../context"
import { locateExcerpt } from "../source/locate-excerpt"
import { getCurrentChunk } from "./context"

/**
 * Normalizes agent-supplied excerpts into positional backlinks.
 *
 * @remarks The excerpt string is a tool input only - what persists is the position. An excerpt crossing a source boundary resolves to one `continuous` backlink so it never reads as several unrelated references.
 */
const resolveExcerpts = (
    context: DistillationAgentContext,
    excerpts: string[]
): Backlink[] => {
    if (excerpts.length === 0) throw new Error("Provide at least one excerpt.")

    const { chunk } = getCurrentChunk(context)

    return excerpts.map(excerpt => {
        const located = locateExcerpt(
            context.sources,
            { sourceIndex: 0, position: chunk.start },
            excerpt
        )

        if (!located)
            throw new Error(
                `Excerpt not found in any loaded source: "${excerpt}". Copy the source text exactly, character for character (watch curly quotes and apostrophes), and prefer short excerpts of a few words.`
            )

        return located.backlink
    })
}

export { resolveExcerpts }
