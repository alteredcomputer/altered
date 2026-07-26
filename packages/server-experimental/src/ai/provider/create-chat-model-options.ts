import type { OpenRouterChatSettings } from "@openrouter/ai-sdk-provider"
import { isLargeLanguageModelId } from "../models/is-model-id"

function createOpenRouterChatModelOptions({
    modelId
}: {
    modelId: string
}): OpenRouterChatSettings {
    let providerOptions: OpenRouterChatSettings["provider"] | undefined

    const isAnthropicModelId = isLargeLanguageModelId(modelId, {
        providers: ["anthropic"]
    })

    const isDeepSeekModelId = isLargeLanguageModelId(modelId, {
        providers: ["deepseek"]
    })

    if (isAnthropicModelId) {
        providerOptions = {
            /**
             * @remarks Required to prevent sticky-routing failures on a 1-hour cache TTL.
             *
             * @see https://github.com/OpenRouterTeam/ai-sdk-provider/issues/499
             */
            only: ["anthropic"]
        }
    } else if (isDeepSeekModelId) {
        providerOptions = {
            /**
             * @remarks Pin DeepInfra FP4 for cost + cache locality on distillation-volume DeepSeek traffic.
             */
            only: ["deepinfra"],
            quantizations: ["fp4"]
        }
    }

    return {
        usage: { include: true },

        provider: {
            require_parameters: true,

            ...(providerOptions ?? {})
        }
    }
}

export { createOpenRouterChatModelOptions }
