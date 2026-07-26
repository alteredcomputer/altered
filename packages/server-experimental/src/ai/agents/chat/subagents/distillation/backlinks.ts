/**
 * In-memory backlink shapes for a distillation run (`sourceIndex` is run-local).
 *
 * @todo P1: Align with / convert via `models/thoughts/persisted-backlinks.ts` on save; persisted rows live in `models/backlinks/storage/schema.ts`.
 */

import { type } from "arktype"

/**
 * `continuous` marks parts that form one uninterrupted excerpt split only by a
 * source boundary (e.g. an SMS-split sentence). Such parts are one span, not
 * separate references, and must never be rendered as individual backlinks.
 */
const backlinkKinds = ["single", "continuous"] as const

const backlinkPartSchema = type({
    sourceIndex: "number.integer",
    start: "number.integer >= 0",
    end: "number.integer >= 0"
})

const backlinkSchema = type({
    kind: "'single' | 'continuous'",
    parts: backlinkPartSchema.array()
})

type BacklinkKind = (typeof backlinkKinds)[number]
type BacklinkPart = typeof backlinkPartSchema.infer
type Backlink = typeof backlinkSchema.infer

const sourceAuthors = ["user", "agent"] as const

type SourceAuthor = (typeof sourceAuthors)[number]

/**
 * Source metadata resolved by follow-up query, never stored on the backlink row.
 *
 * @remarks Authorship lives on its own table and the dates belong to the source, so persisting copies here would only rot. They are aggregated at the app level where a thought is read alongside its sources.
 */
type ResolvedBacklinkSource = {
    type: "chat-message" | "thought"
    id: string

    author: SourceAuthor

    createdAt: Date
    updatedAt: Date

    /**
     * When the source entered ALTERED - distinct from when it was authored.
     */
    addedAt: Date
}

type ResolvedBacklinkPart = Omit<BacklinkPart, "sourceIndex"> & {
    source: ResolvedBacklinkSource
    text: string
}

type ResolvedBacklink = {
    kind: BacklinkKind
    parts: ResolvedBacklinkPart[]
}

export {
    type Backlink,
    type BacklinkKind,
    type BacklinkPart,
    backlinkKinds,
    backlinkPartSchema,
    backlinkSchema,
    type ResolvedBacklink,
    type ResolvedBacklinkPart,
    type ResolvedBacklinkSource,
    type SourceAuthor,
    sourceAuthors
}
