import type { LanguageModelID } from "@altered/core-experimental/config/ai"
import { and, desc, eq, isNull, lt } from "drizzle-orm"
import { type ChatMessage, chatMessages } from "../../../chat/messages/schema"
import { toPlainText } from "../../../chat/messages/to-plain-text"
import { getDatabase } from "../../../storage/database/connection"
import {
    createDistillationAgent,
    DEFAULT_DISTILLATION_MODEL_ID
} from "../../agents/chat/subagents/distillation/definition"
import { distillationChatMessageInstructions } from "../../agents/chat/subagents/distillation/instructions/chat-messages"

const toAuthor = (role: ChatMessage["role"]): "user" | "agent" =>
    role === "assistant" ? "agent" : "user"

const createAgentForMessage = (options: {
    message: ChatMessage
    modelId?: LanguageModelID
    debug?: { thinking?: boolean }
}) => {
    const database = getDatabase()
    let earliestLoaded = options.message

    return createDistillationAgent({
        modelId: options.modelId ?? DEFAULT_DISTILLATION_MODEL_ID,

        fetchPreviousSource: async () => {
            const [previous] = await database
                .select()
                .from(chatMessages)
                .where(
                    and(
                        eq(
                            chatMessages.conversationId,
                            earliestLoaded.conversationId
                        ),
                        isNull(chatMessages.userId),
                        lt(chatMessages.createdAt, earliestLoaded.createdAt)
                    )
                )
                .orderBy(desc(chatMessages.createdAt))
                .limit(1)

            if (!previous) return null

            earliestLoaded = previous

            return {
                id: previous.id,
                author: toAuthor(previous.role),
                text: toPlainText(previous.content)
            }
        },

        debug: options.debug,
        instructions: { extensions: [distillationChatMessageInstructions] }
    })
}

export { createAgentForMessage, toAuthor }
