import type { Backlink, BacklinkPart } from "../backlinks"
import type { DistillationSource } from "../context"
import {
    buildSourceDocument,
    type SourceDocument,
    toDocumentPosition
} from "./document"

type ExcerptAnchor = {
    sourceIndex: number
    position: number
}

type LocatedExcerpt = {
    backlink: Backlink

    /**
     * The matched source text - for tool responses and logs only, never stored.
     */
    text: string
}

/**
 * Resolves a verbatim excerpt to positional backlinks, preferring the
 * occurrence nearest the anchor (the current chunk).
 *
 * @remarks Matching runs against every loaded source concatenated into one document, so an excerpt may span chunks and even source boundaries. A boundary-crossing match resolves to a single `continuous` backlink rather than several unrelated-looking spans.
 */
const locateExcerpt = (
    sources: DistillationSource[],
    anchor: ExcerptAnchor,
    excerpt: string
): LocatedExcerpt | null => {
    if (excerpt.trim().length === 0) return null

    const document = buildSourceDocument(sources)
    const anchorPosition = toDocumentPosition(
        document,
        anchor.sourceIndex,
        anchor.position
    )

    const range =
        findNearestExactRange(document.text, excerpt, anchorPosition) ??
        findNearestLooseRange(document.text, excerpt, anchorPosition)

    if (!range) return null

    const parts = toBacklinkParts(document, range)

    if (parts.length === 0) return null

    return {
        backlink: {
            kind: parts.length > 1 ? "continuous" : "single",
            parts
        },

        text: document.text.slice(range.start, range.end)
    }
}

type DocumentRange = {
    start: number
    end: number
}

const findNearestExactRange = (
    document: string,
    excerpt: string,
    anchor: number
): DocumentRange | null => {
    let best: DocumentRange | null = null
    let from = 0

    while (from <= document.length) {
        const at = document.indexOf(excerpt, from)

        if (at === -1) break

        if (!best || Math.abs(at - anchor) < Math.abs(best.start - anchor))
            best = { start: at, end: at + excerpt.length }

        from = at + 1
    }

    return best
}

/**
 * Fallback match that ignores whitespace differences, covering excerpts the
 * agent re-spaced while joining text across a chunk or source boundary.
 */
const findNearestLooseRange = (
    document: string,
    excerpt: string,
    anchor: number
): DocumentRange | null => {
    const normalizedDocument = normalizeWhitespace(document)
    const normalizedExcerpt = collapseWhitespace(excerpt).trim()

    if (normalizedExcerpt.length === 0) return null

    const anchorIndex = normalizedDocument.offsets.findIndex(
        offset => offset >= anchor
    )
    const normalizedAnchor =
        anchorIndex === -1 ? normalizedDocument.text.length : anchorIndex

    const match = findNearestExactRange(
        normalizedDocument.text,
        normalizedExcerpt,
        normalizedAnchor
    )

    if (!match) return null

    const start = normalizedDocument.offsets[match.start]
    const lastOffset = normalizedDocument.offsets[match.end - 1]

    if (start === undefined || lastOffset === undefined) return null

    return { start, end: lastOffset + 1 }
}

const WHITESPACE_PATTERN = /\s/
const WHITESPACE_RUN_PATTERN = /\s+/g

type NormalizedText = {
    text: string

    /**
     * Original index of each normalized character.
     */
    offsets: number[]
}

const normalizeWhitespace = (source: string): NormalizedText => {
    let text = ""
    const offsets: number[] = []

    for (let index = 0; index < source.length; index += 1) {
        const character = source[index] as string

        if (!WHITESPACE_PATTERN.test(character)) {
            text += character
            offsets.push(index)

            continue
        }

        if (text.endsWith(" ")) continue

        text += " "
        offsets.push(index)
    }

    return { text, offsets }
}

const collapseWhitespace = (source: string): string =>
    source.replace(WHITESPACE_RUN_PATTERN, " ")

const toBacklinkParts = (
    document: SourceDocument,
    range: DocumentRange
): BacklinkPart[] =>
    document.segments
        .map(segment => ({
            sourceIndex: segment.sourceIndex,
            start: Math.max(range.start, segment.start) - segment.start,
            end: Math.min(range.end, segment.end) - segment.start
        }))
        .filter(part => part.end > part.start)

export { type ExcerptAnchor, type LocatedExcerpt, locateExcerpt }
