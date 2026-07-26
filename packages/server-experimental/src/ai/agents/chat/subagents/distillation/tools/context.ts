import {
    type DistillationAgentContext,
    type DistillationSource,
    distillationAgentContextSchema
} from "../context"
import type { SourceChunk } from "../source/split"

const getContext = (experimental_context: unknown): DistillationAgentContext =>
    distillationAgentContextSchema.assert(experimental_context)

const getCurrentSource = (
    context: DistillationAgentContext
): DistillationSource => {
    const source = context.sources.find(entry => entry.index === 0)

    if (!source) throw new Error("Current source (index 0) is missing.")

    return source
}

const getCurrentChunk = (
    context: DistillationAgentContext
): { source: DistillationSource; chunk: SourceChunk } => {
    const source = getCurrentSource(context)
    const chunk = source.chunks[context.chunkIndex]

    if (!chunk) throw new Error("Current distillation chunk is missing.")

    return { source, chunk }
}

export { getContext, getCurrentChunk, getCurrentSource }
