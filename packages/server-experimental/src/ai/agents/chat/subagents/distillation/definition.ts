import type { LanguageModelID } from "@altered/core-experimental/config/ai"
import { ToolLoopAgent } from "ai"
import { type } from "arktype"
import { composeInstructions } from "../../../../instructions/composition"
import { userLanguageStylePreferences } from "../../../../instructions/user-language-style"
import { createOpenrouterChatModel } from "../../../../provider/create-chat-model"
import { distillationAgentContextSchema } from "./context"
import { distillationAgentInstructions } from "./instructions/agent"
import { distillationThinkingInstructions } from "./instructions/thinking"
import type { FetchPreviousSource } from "./source/previous"
import { createDistillationToolSet } from "./tools/set"

const distillationAgentId = "distillation" as const

/**
 * @remarks Distillation is a high-volume, small-context loop, so it runs a cheaper model than the chat agent. Re-benchmark before raising it.
 */
const DEFAULT_DISTILLATION_MODEL_ID: LanguageModelID = "openai/gpt-5.6-luna"

const distillationAgentCallOptionsSchema = type({
    context: distillationAgentContextSchema
})

type DistillationAgentCallOptions =
    typeof distillationAgentCallOptionsSchema.infer

type CreateDistillationAgentOptions = {
    modelId?: LanguageModelID

    /**
     * Resolves the source item immediately before the earliest loaded source
     * (e.g. the previous chat message). Generic per source type.
     */
    fetchPreviousSource?: FetchPreviousSource

    debug?: {
        /**
         * Requires a short "thinking" line on record/update calls.
         */
        thinking?: boolean
    }

    instructions?: {
        /**
         * Source-type-specific additions (e.g. Koa chat perspective rules).
         */
        extensions?: string[]
    }
}

const createDistillationAgent = (
    options: CreateDistillationAgentOptions = {}
) => {
    const includeThinking = options.debug?.thinking ?? false

    const tools = createDistillationToolSet({
        fetchPreviousSource: options.fetchPreviousSource,
        includeThinking
    })

    return new ToolLoopAgent({
        id: distillationAgentId,

        model: createOpenrouterChatModel({
            modelId: options.modelId ?? DEFAULT_DISTILLATION_MODEL_ID
        }),

        tools,
        activeTools: Object.keys(tools) as (keyof typeof tools)[],
        toolChoice: "required",
        experimental_context: null,

        callOptionsSchema: distillationAgentCallOptionsSchema,

        prepareCall: ({ options: { context }, ...params }) => ({
            ...params,

            //  Chunk metadata is intentionally passed as a system message.
            allowSystemInMessages: true,

            experimental_context: context,

            instructions: composeInstructions([
                distillationAgentInstructions,
                includeThinking ? distillationThinkingInstructions : null,
                ...(options.instructions?.extensions ?? []),
                userLanguageStylePreferences
            ])
        }),

        prepareStep: ({ stepNumber }) => {
            if (stepNumber === 0)
                return {
                    activeTools: ["query-thoughts"],
                    toolChoice: { type: "tool", toolName: "query-thoughts" }
                }
        },

        /**
         * @remarks Catastrophic-failure guard only - the loop exits via the `complete` no-op tool.
         */
        stopWhen: ({ steps }) => steps.length === 25,

        instructions:
            "These system instructions should be entirely overridden. Please indicate a technical error."
    })
}

export {
    type CreateDistillationAgentOptions,
    createDistillationAgent,
    DEFAULT_DISTILLATION_MODEL_ID,
    type DistillationAgentCallOptions,
    distillationAgentCallOptionsSchema,
    distillationAgentId
}
