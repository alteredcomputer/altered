import type { DistillationSource } from "../context"

type SourceDocumentSegment = {
    sourceIndex: number

    /**
     * Offsets within the concatenated document.
     */
    start: number
    end: number
}

type SourceDocument = {
    text: string
    segments: SourceDocumentSegment[]
}

/**
 * Separator inserted between sources in the concatenated document.
 *
 * @remarks Sources have no literal text between them; a newline is the closest analogue and is excluded from every resolved span.
 */
const SOURCE_SEPARATOR = "\n"

/**
 * Concatenates all loaded sources in order so an excerpt can be matched even
 * when it runs across a source boundary.
 */
const buildSourceDocument = (sources: DistillationSource[]): SourceDocument => {
    const ordered = [...sources].sort((a, b) => a.index - b.index)
    const segments: SourceDocumentSegment[] = []

    let text = ""

    for (const source of ordered) {
        if (text.length > 0) text += SOURCE_SEPARATOR

        segments.push({
            sourceIndex: source.index,
            start: text.length,
            end: text.length + source.text.length
        })

        text += source.text
    }

    return { text, segments }
}

const toDocumentPosition = (
    document: SourceDocument,
    sourceIndex: number,
    position: number
): number => {
    const segment = document.segments.find(
        entry => entry.sourceIndex === sourceIndex
    )

    return segment ? segment.start + position : position
}

export {
    buildSourceDocument,
    SOURCE_SEPARATOR,
    type SourceDocument,
    type SourceDocumentSegment,
    toDocumentPosition
}
