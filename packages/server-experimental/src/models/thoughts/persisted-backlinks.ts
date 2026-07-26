import { type } from "arktype"
import { nanoid } from "nanoid"
import type { BacklinkKind } from "../backlinks/storage/schema"

/**
 * A backlink part as stored on a derived thought - source id resolved, not a
 * run-local sourceIndex.
 */
const persistedBacklinkPartSchema = type({
    source: {
        type: "'chat-message' | 'thought'",
        id: "string"
    },
    start: "number.integer >= 0",
    end: "number.integer >= 0"
})

/**
 * @remarks `continuous` is one uninterrupted excerpt split only by a source
 * boundary - never render its parts as separate backlinks.
 */
const persistedBacklinkSchema = type({
    kind: "'single' | 'continuous'",
    parts: persistedBacklinkPartSchema.array()
})

type PersistedBacklinkPart = typeof persistedBacklinkPartSchema.infer
type PersistedBacklink = typeof persistedBacklinkSchema.infer

type BacklinkInsertValues = {
    thoughtId: string
    groupId: string
    kind: BacklinkKind
    partIndex: number
    sourceType: PersistedBacklinkPart["source"]["type"]
    sourceId: string
    start: number
    end: number
}

/**
 * Flattens logical backlinks into `backlinks` table rows (one row per part).
 */
const toBacklinkInsertValues = (
    thoughtId: string,
    backlinks: PersistedBacklink[]
): BacklinkInsertValues[] =>
    persistedBacklinkSchema
        .array()
        .assert(backlinks)
        .flatMap(backlink => {
            const groupId = nanoid()

            return backlink.parts.map((part, partIndex) => ({
                thoughtId,
                groupId,
                kind: backlink.kind,
                partIndex,
                sourceType: part.source.type,
                sourceId: part.source.id,
                start: part.start,
                end: part.end
            }))
        })

export {
    type BacklinkInsertValues,
    type PersistedBacklink,
    type PersistedBacklinkPart,
    persistedBacklinkSchema,
    toBacklinkInsertValues
}
