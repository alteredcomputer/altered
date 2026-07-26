/**
 * Scratchpad / CLI entry for the distillation POC.
 *
 * @remarks Pass `--persist` to write derived thoughts + an `agent_runs` row.
 * Pass `--index` with `--persist` to run the keyword pipeline on saved thoughts.
 * Production on-save path uses `distillChatMessage` directly via `schedule`.
 */

import "dotenv/config"

import { parseArgs } from "node:util"
import type { LanguageModelID } from "@altered/core-experimental/config/ai"
import { and, asc, eq, isNull } from "drizzle-orm"
import { DEFAULT_DISTILLATION_MODEL_ID } from "../src/ai/agents/chat/subagents/distillation/definition"
import { distillChatMessage } from "../src/ai/memory/distillation/run-for-chat-message"
import { chatMessages } from "../src/chat/messages/schema"
import { getDatabase } from "../src/storage/database/connection"

const { values } = parseArgs({
    options: {
        "message-id": { type: "string" },
        "max-chunks": { type: "string" },
        model: { type: "string" },
        persist: { type: "boolean", default: false },
        index: { type: "boolean", default: false }
    }
})

const resolveMessageId = async (): Promise<string> => {
    if (values["message-id"]) return values["message-id"]

    const database = getDatabase()

    const [message] = await database
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(and(eq(chatMessages.role, "user"), isNull(chatMessages.userId)))
        .orderBy(asc(chatMessages.createdAt))
        .limit(1)

    if (!message) throw new Error("No chat message found to distill.")

    return message.id
}

const main = async () => {
    const shouldPersist = values.persist === true
    const shouldIndex = values.index === true

    if (shouldIndex && !shouldPersist)
        throw new Error("--index requires --persist.")

    const messageId = await resolveMessageId()

    const result = await distillChatMessage({
        messageId,
        modelId: (values.model ??
            DEFAULT_DISTILLATION_MODEL_ID) as LanguageModelID,
        maxChunks: values["max-chunks"]
            ? Number(values["max-chunks"])
            : undefined,
        persist: shouldPersist,
        indexKeywords: shouldIndex,
        debug: { thinking: true },
        log: true
    })

    console.log(
        `[distill] done - ${result.thoughtCount} thoughts, run ${result.agentRunId ?? "none"}`
    )
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
