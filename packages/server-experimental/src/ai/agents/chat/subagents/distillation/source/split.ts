import { type } from "arktype"

const sourceChunkSchema = type({
    index: "number.integer >= 0",
    start: "number.integer >= 0",
    end: "number.integer >= 0",
    text: "string",
    kind: "'sentence' | 'length-fallback'"
})

type SourceChunk = typeof sourceChunkSchema.infer
type SourceChunkKind = SourceChunk["kind"]

type SplitSourceOptions = {
    /**
     * Character cutoff when no sentence or line boundary exists in a span.
     *
     * @remarks Defaults to an approximate average sentence length.
     */
    fallbackLength?: number
}

type ChunkBoundary = {
    offset: number
    kind: SourceChunkKind
}

const DEFAULT_FALLBACK_LENGTH = 120

/**
 * Matches a sentence terminator plus optional closing punctuation or markdown
 * marks, ending right before whitespace so the whitespace joins the next chunk.
 */
const SENTENCE_END_PATTERN = /[.!?]["')\]*_`~]*(?=\s|$)/

/**
 * Splits source text into sequential chunks for distillation.
 *
 * @remarks Sentence terminators and line breaks both delimit chunks. Whitespace between chunks is prepended to the following chunk (trailing whitespace is appended to the last chunk) so the chunks always concatenate back to the exact source.
 */
const splitSourceIntoChunks = (
    source: string,
    options: SplitSourceOptions = {}
): SourceChunk[] => {
    const fallbackLength = options.fallbackLength ?? DEFAULT_FALLBACK_LENGTH
    const chunks: SourceChunk[] = []
    let cursor = 0

    while (cursor < source.length) {
        const contentStart = findContentStart(source, cursor)

        if (contentStart === source.length) {
            const last = chunks.at(-1)

            if (last) {
                last.end = source.length
                last.text = source.slice(last.start)
            }

            break
        }

        const rest = source.slice(contentStart)
        const boundary = findChunkBoundary(rest, fallbackLength)
        const end = contentStart + boundary.offset

        chunks.push({
            index: chunks.length,
            start: cursor,
            end,
            text: source.slice(cursor, end),
            kind: boundary.kind
        })

        cursor = end
    }

    return chunks
}

const findContentStart = (source: string, cursor: number): number => {
    let index = cursor

    while (index < source.length && isWhitespace(source.at(index))) index += 1

    return index
}

const findChunkBoundary = (
    rest: string,
    fallbackLength: number
): ChunkBoundary => {
    const sentence = SENTENCE_END_PATTERN.exec(rest)
    const sentenceOffset = sentence ? sentence.index + sentence[0].length : null

    const newlineIndex = rest.indexOf("\n")
    const newlineOffset = newlineIndex === -1 ? null : newlineIndex

    if (
        sentenceOffset !== null &&
        (newlineOffset === null || sentenceOffset <= newlineOffset)
    )
        return { offset: sentenceOffset, kind: "sentence" }

    if (newlineOffset !== null)
        return { offset: newlineOffset, kind: "sentence" }

    if (rest.length <= fallbackLength)
        return { offset: rest.length, kind: "length-fallback" }

    return {
        offset: findFallbackCut(rest, fallbackLength),
        kind: "length-fallback"
    }
}

const findFallbackCut = (text: string, fallbackLength: number): number => {
    const window = text.slice(0, fallbackLength)
    const lastSpace = window.lastIndexOf(" ")

    if (lastSpace > fallbackLength * 0.5) return lastSpace + 1

    return fallbackLength
}

const isWhitespace = (character: string | undefined): boolean =>
    character === " " ||
    character === "\n" ||
    character === "\t" ||
    character === "\r"

export {
    DEFAULT_FALLBACK_LENGTH,
    type SourceChunk,
    type SourceChunkKind,
    type SplitSourceOptions,
    sourceChunkSchema,
    splitSourceIntoChunks
}
