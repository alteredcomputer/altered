import type { SourceAuthor } from "../backlinks"
import type { DistillationAgentContext, DistillationSource } from "../context"
import { splitSourceIntoChunks } from "./split"

type FetchedPreviousSource = {
    id: string
    author: SourceAuthor
    text: string
}

/**
 * Fetches the source item immediately before the earliest loaded source
 * (e.g. the previous chat message). Generic so other source types (notes) can
 * wire their own resolution.
 */
type FetchPreviousSource = (options: {
    earliest: { sourceIndex: number; id: string }
}) => Promise<FetchedPreviousSource | null>

/**
 * Loads and memoizes the source before the current one, indexed negatively so
 * chunk indexes never shift.
 *
 * @todo P3: Support fetching deeper history than one source back (index -2 and beyond).
 *
 * @todo P2: Live-test the callback against a conversation where the referent only resolves two or more messages back.
 */
const ensurePreviousSource = async (
    context: DistillationAgentContext,
    fetchPreviousSource: FetchPreviousSource | undefined
): Promise<DistillationSource | null> => {
    const existing = context.sources.find(entry => entry.index === -1)

    if (existing) return existing
    if (!fetchPreviousSource) return null

    const current = context.sources.find(entry => entry.index === 0)

    if (!current) throw new Error("Current source (index 0) is missing.")

    const fetched = await fetchPreviousSource({
        earliest: { sourceIndex: 0, id: current.id }
    })

    if (!fetched) return null

    const source: DistillationSource = {
        index: -1,
        id: fetched.id,
        author: fetched.author,
        text: fetched.text,
        chunks: splitSourceIntoChunks(fetched.text)
    }

    context.sources.push(source)

    return source
}

export {
    ensurePreviousSource,
    type FetchedPreviousSource,
    type FetchPreviousSource
}
