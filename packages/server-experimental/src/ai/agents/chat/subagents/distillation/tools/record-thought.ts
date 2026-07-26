import { tool } from "ai"
import { type } from "arktype"
import { getContext } from "./context"
import { resolveExcerpts } from "./excerpts"
import { type DistillationToolOptions, thinkingProperty } from "./options"

const recordThoughtBase = {
    content: type("string").describe(
        "One precise sentence - a single self-contained concept."
    ),
    excerpts: type("string[]").describe(
        "Verbatim source excerpts (at least one) that directly shaped this thought. Use multiple excerpts to skip unrelated words."
    )
} as const

type RecordThoughtInput = {
    content: string
    excerpts: string[]
    thinking?: string
}

const shared = {
    title: "Record Thought",
    description:
        "Record one new distilled thought, referenced by verbatim source excerpts.",

    type: "function",
    strict: true
} as const

const createRecordThoughtTool = (options: DistillationToolOptions) => {
    const record = (
        input: RecordThoughtInput,
        experimental_context: unknown
    ) => {
        const context = getContext(experimental_context)

        //  Cheap guard against a weaker model looping on the same thought.
        const duplicate = context.collectedThoughts.findIndex(
            thought => thought.content === input.content
        )

        if (duplicate !== -1)
            return { success: true as const, index: duplicate }

        const backlinks = resolveExcerpts(context, input.excerpts)

        context.collectedThoughts.push({
            content: input.content,
            backlinks,
            ...(input.thinking ? { thinking: input.thinking } : {})
        })

        return {
            success: true as const,
            index: context.collectedThoughts.length - 1
        }
    }

    if (options.includeThinking)
        return tool({
            ...shared,
            inputSchema: type({
                ...recordThoughtBase,
                thinking: thinkingProperty
            }),
            execute: (input, { experimental_context }) =>
                record(input, experimental_context)
        })

    return tool({
        ...shared,
        inputSchema: type(recordThoughtBase),
        execute: (input, { experimental_context }) =>
            record(input, experimental_context)
    })
}

export { createRecordThoughtTool }
