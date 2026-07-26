import type { BacklinkPart } from "../backlinks"
import type { DistillationAgentContext } from "../context"

type TextSegment = {
    sourceIndex: number
    start: number
    end: number
    text: string
}

/**
 * Previously distilled thoughts whose backlinks overlap any of the given
 * segments, so returned context always carries what was already covered.
 *
 * @todo P2: Also query the database for persisted thoughts with overlapping backlinks once persistence lands (dedupe-on-creation).
 */
const findOverlappingThoughts = (
    context: DistillationAgentContext,
    segments: TextSegment[]
) =>
    context.collectedThoughts
        .map((thought, index) => ({ index, thought }))
        .filter(({ thought }) =>
            thought.backlinks.some(backlink =>
                backlink.parts.some(part => overlapsAny(part, segments))
            )
        )
        .map(({ index, thought }) => ({ index, content: thought.content }))

const overlapsAny = (part: BacklinkPart, segments: TextSegment[]): boolean =>
    segments.some(
        segment =>
            segment.sourceIndex === part.sourceIndex &&
            part.start < segment.end &&
            part.end > segment.start
    )

export { findOverlappingThoughts, type TextSegment }
