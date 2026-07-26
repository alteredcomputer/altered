import type { ModelMessage } from "ai"
import { toPlainText } from "./to-plain-text"

type PersistableChatMessage = {
    role: "user" | "assistant"
    content: string
}

/**
 * Strip tool/reasoning/multipart noise into plain-text chat rows.
 *
 * @remarks Persisted history mirrors the iMessage transcript: status updates
 * and final replies as separate text rows. Tool calls, tool results, and
 * reasoning are dropped — traces live on OpenRouter / agent_runs.
 */
const stripMessagesForPersistence = (
    messages: ModelMessage[]
): PersistableChatMessage[] => {
    const rows: PersistableChatMessage[] = []

    for (const message of messages) {
        if (message.role !== "user" && message.role !== "assistant") continue

        const content = toPlainText(message.content).trim()

        if (content.length === 0) continue

        rows.push({ role: message.role, content })
    }

    return rows
}

export { type PersistableChatMessage, stripMessagesForPersistence }
