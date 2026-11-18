import { type } from "arktype"
import type { AssertExactMatch } from "../../typescript/exact-match.ts"
import type { ALTEREDThought, ALTEREDThoughtID } from "./definitions.ts"

const alteredThoughtIdSchema = type("string").as<ALTEREDThoughtID>()

const _alteredThoughtIdSchemaIntegrityCheck: AssertExactMatch<
    ALTEREDThoughtID,
    typeof alteredThoughtIdSchema.infer
> = true

/**
 * The standard schema for a Thought. Should be used for everything except for when translating from the database to a standard thought, or resolving draft thoughts to standard thoughts.
 */
const alteredThoughtSchema = type({
    id: alteredThoughtIdSchema,

    alias: "string",
    content: "string",

    createdAt: "Date",
    updatedAt: "Date",

    addedAt: "Date"
})

const _alteredThoughtSchemaIntegrityCheck: AssertExactMatch<
    ALTEREDThought,
    typeof alteredThoughtSchema.infer
> = true

export { alteredThoughtIdSchema, alteredThoughtSchema }
