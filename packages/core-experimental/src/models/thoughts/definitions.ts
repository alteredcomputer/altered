import type { Brand } from "../../typescript/brand"
import type { ALTEREDAttributeID } from "../attributes/definitions"
import type { ALTEREDDatasetID } from "../datasets/definitions"
import type { ALTEREDSchemaID } from "../schemas/definitions"

type ALTEREDThoughtID = Brand<string, "@altered/thoughts/id">

/**
 * @todo P1: Determine if brains should be a separate primitive.
 */
type ALTEREDThoughtKindID = "dataset" | "attribute" | "schema"

type ALTEREDThoughtBase = {
    id: ALTEREDThoughtID

    alias: string
    content: string

    datasetIds: ALTEREDDatasetID[]
    attributeIds: ALTEREDAttributeID[]
}

type ALTEREDBaseThought = ALTEREDThoughtBase & {
    kind: null
    associatedId: null
}

type ALTEREDDatasetThought = ALTEREDThoughtBase & {
    kind: "dataset"
    associatedId: ALTEREDDatasetID
}

type ALTEREDSchemaThought = ALTEREDThoughtBase & {
    kind: "schema"
    associatedId: ALTEREDSchemaID
}

type ALTEREDAttributeThought = ALTEREDThoughtBase & {
    kind: "attribute"
    associatedId: ALTEREDAttributeID
}

type ALTEREDThought =
    | ALTEREDBaseThought
    | ALTEREDDatasetThought
    | ALTEREDSchemaThought
    | ALTEREDAttributeThought

export type {
    ALTEREDAttributeThought,
    ALTEREDBaseThought,
    ALTEREDDatasetThought,
    ALTEREDSchemaThought,
    ALTEREDThought,
    ALTEREDThoughtBase,
    ALTEREDThoughtID,
    ALTEREDThoughtKindID
}
