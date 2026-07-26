import { type } from "arktype"
import { backlinkSchema } from "./backlinks"
import { sourceChunkSchema } from "./source/split"

/**
 * One loaded source item (e.g. a chat message).
 *
 * @remarks Index 0 is the source being distilled; negative indexes are earlier sources fetched on demand for context.
 */
const distillationSourceSchema = type({
    index: "number.integer",
    id: "string",
    author: "'user' | 'agent'",
    text: "string",
    chunks: sourceChunkSchema.array()
})

/**
 * A thought held in memory for the duration of a distillation run.
 *
 * @remarks Excerpts are normalized to positional backlinks on the way in - the excerpt string itself is an agent input, never stored.
 */
const collectedThoughtSchema = type({
    content: "string",
    backlinks: backlinkSchema.array(),
    "thinking?": "string"
})

const distillationAgentContextSchema = type({
    sources: distillationSourceSchema.array(),
    chunkIndex: "number.integer >= 0",
    collectedThoughts: collectedThoughtSchema.array()
})

type DistillationSource = typeof distillationSourceSchema.infer
type CollectedThought = typeof collectedThoughtSchema.infer
type DistillationAgentContext = typeof distillationAgentContextSchema.infer

export {
    type CollectedThought,
    collectedThoughtSchema,
    type DistillationAgentContext,
    type DistillationSource,
    distillationAgentContextSchema,
    distillationSourceSchema
}
