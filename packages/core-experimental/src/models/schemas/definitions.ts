import type { Brand } from "../../typescript/brand"
import type { KebabToSnakeCase } from "../../typescript/case-transformations"
import type { ALTEREDDatasetID } from "../datasets/definitions"
import type { ALTEREDThoughtID } from "../thoughts/definitions"

type ALTEREDSchemaID = Brand<string, "@altered/schemas/id">

const ALTERED_SCHEMA_TYPE_IDS = [
    "text",
    "thought",
    "dataset",
    "custom"
] as const
type ALTEREDSchemaTypeID = (typeof ALTERED_SCHEMA_TYPE_IDS)[number]

const ALTERED_SCHEMA_TYPE_ID_MAP = {
    TEXT: "text",
    THOUGHT: "thought",
    DATASET: "dataset",
    CUSTOM: "custom"
} as const satisfies Record<
    Uppercase<KebabToSnakeCase<ALTEREDSchemaTypeID>>,
    ALTEREDSchemaTypeID
>

type ALTEREDSchema = {
    id: ALTEREDSchemaID
    thoughtId: ALTEREDThoughtID

    type: ALTEREDSchemaTypeID

    /**
     * When true, thoughts in datasets that use this schema must expose a matching attribute or be treated as incomplete.
     *
     * @remarks Defaults to true for strict control. "unset" is represented by the absence of an attribute (not a null attribute value).
     */
    required: boolean

    /**
     * Schema configuration payload.
     *
     * @remarks `null` for current "text", "thought", and "dataset" types. For "custom", it is a serialized JSON Schema string (generated and parsed by ArkType).
     *
     * @todo P3: Explore how we could expand schemas to support more primitive types and primitive customizations. Direct ArkType interpretation is an option as well.
     */
    value: string | null

    datasetIds: ALTEREDDatasetID[]
}

export {
    ALTERED_SCHEMA_TYPE_ID_MAP,
    ALTERED_SCHEMA_TYPE_IDS,
    type ALTEREDSchema,
    type ALTEREDSchemaID,
    type ALTEREDSchemaTypeID
}
