import type { Backlink } from "../backlinks"
import type { DistillationSource } from "../context"

/**
 * Reads the source text behind a backlink.
 *
 * @remarks Positions are the stored form; the text is always derived, never persisted alongside them.
 */
const readBacklink = (sources: DistillationSource[], backlink: Backlink) => ({
    kind: backlink.kind,

    parts: backlink.parts.map(part => ({
        ...part,

        text:
            sources
                .find(source => source.index === part.sourceIndex)
                ?.text.slice(part.start, part.end) ?? ""
    }))
})

export { readBacklink }
