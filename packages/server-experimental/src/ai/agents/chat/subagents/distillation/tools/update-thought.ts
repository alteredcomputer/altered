import { tool } from "ai"
import { type } from "arktype"
import { getContext } from "./context"
import { resolveExcerpts } from "./excerpts"
import { type DistillationToolOptions, thinkingProperty } from "./options"

const updateThoughtBase = {
    index: type("number.integer >= 0").describe(
        "Index of the previously distilled thought to update."
    ),
    "content?": type("string").describe(
        "Replacement content - only for a duplication, refinement, or slight extension of the same concept."
    ),
    "addExcerpts?": type("string[]").describe(
        "Additional verbatim excerpts to backlink (e.g. this chunk's text)."
    )
} as const

type UpdateThoughtInput = {
    index: number
    content?: string
    addExcerpts?: string[]
    thinking?: string
}

const shared = {
    title: "Update Thought",
    description:
        "Update a previously distilled thought - only for a duplication, refinement, or slight extension of the same single concept.",

    type: "function",
    strict: true
} as const

const createUpdateThoughtTool = (options: DistillationToolOptions) => {
    const update = (
        input: UpdateThoughtInput,
        experimental_context: unknown
    ) => {
        const context = getContext(experimental_context)
        const thought = context.collectedThoughts[input.index]

        if (!thought)
            throw new Error(
                `No distilled thought exists at index ${input.index}.`
            )

        if (input.content) thought.content = input.content
        if (input.addExcerpts?.length)
            thought.backlinks.push(
                ...resolveExcerpts(context, input.addExcerpts)
            )
        if (input.thinking) thought.thinking = input.thinking

        return { success: true as const, index: input.index }
    }

    if (options.includeThinking)
        return tool({
            ...shared,
            inputSchema: type({
                ...updateThoughtBase,
                thinking: thinkingProperty
            }),
            execute: (input, { experimental_context }) =>
                update(input, experimental_context)
        })

    return tool({
        ...shared,
        inputSchema: type(updateThoughtBase),
        execute: (input, { experimental_context }) =>
            update(input, experimental_context)
    })
}

export { createUpdateThoughtTool }
