/**
 * Backfill distillation for every message in a conversation.
 *
 * @remarks Modes: `skip` (default) | `overwrite` | `duplicate`.
 * All runs share one `batchId` for filtering. Prefer `--max-messages` first.
 *
 * @example
 * pnpm run:reindex-conversation -- --conversation-id <id> --mode skip --index
 */

import "dotenv/config"

import { parseArgs } from "node:util"
import { asc, eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { listDistilledChatMessageIds } from "../src/ai/memory/distillation/list-distilled-message-ids"
import { distillChatMessage } from "../src/ai/memory/distillation/run-for-chat-message"
import { chatMessages } from "../src/chat/messages/schema"
import { toPlainText } from "../src/chat/messages/to-plain-text"
import { deleteDerivedThoughtsForChatMessage } from "../src/models/thoughts/delete-derived-for-chat-message"
import { getDatabase } from "../src/storage/database/connection"

const REINDEX_MODES = ["skip", "overwrite", "duplicate"] as const
type ReindexMode = (typeof REINDEX_MODES)[number]

const { values } = parseArgs({
    options: {
        "conversation-id": { type: "string" },
        mode: { type: "string", default: "skip" },
        index: { type: "boolean", default: false },
        "max-messages": { type: "string" },
        "dry-run": { type: "boolean", default: false }
    }
})

const resolveMode = (value: string | undefined): ReindexMode => {
    if (value && REINDEX_MODES.includes(value as ReindexMode))
        return value as ReindexMode

    throw new Error(
        `Invalid --mode. Expected one of: ${REINDEX_MODES.join(", ")}`
    )
}

const main = async () => {
    const conversationId = values["conversation-id"]

    if (!conversationId) throw new Error("--conversation-id is required.")

    const mode = resolveMode(values.mode)
    const shouldIndex = values.index === true
    const dryRun = values["dry-run"] === true
    const maxMessages = values["max-messages"]
        ? Number(values["max-messages"])
        : undefined

    const database = getDatabase()
    const batchId = nanoid()

    const messages = await database
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, conversationId))
        .orderBy(asc(chatMessages.createdAt))

    const distilledIds = await listDistilledChatMessageIds(conversationId)
    const candidates = messages.filter(
        message => toPlainText(message.content).trim().length > 0
    )

    const selected =
        maxMessages === undefined
            ? candidates
            : candidates.slice(0, maxMessages)

    console.log(
        `[reindex] conversation ${conversationId} - ${selected.length}/${candidates.length} messages, mode=${mode}, batch=${batchId}${dryRun ? " (dry-run)" : ""}`
    )

    let distilled = 0
    let skipped = 0
    let failed = 0

    for (const message of selected) {
        const alreadyDistilled = distilledIds.has(message.id)

        if (mode === "skip" && alreadyDistilled) {
            skipped += 1
            console.log(`[reindex] skip ${message.id} (${message.role})`)
            continue
        }

        if (dryRun) {
            console.log(
                `[reindex] would ${mode} ${message.id} (${message.role})${alreadyDistilled ? " [distilled]" : ""}`
            )
            continue
        }

        if (mode === "overwrite") {
            const deleted = await deleteDerivedThoughtsForChatMessage(
                message.id
            )

            if (deleted > 0)
                console.log(
                    `[reindex] overwrite cleared ${deleted} thoughts for ${message.id}`
                )
        }

        try {
            const result = await distillChatMessage({
                messageId: message.id,
                persist: true,
                indexKeywords: shouldIndex,
                batchId,
                log: true
            })

            distilled += 1
            distilledIds.add(message.id)
            console.log(
                `[reindex] ok ${message.id} → ${result.thoughtCount} thoughts (${result.agentRunId})`
            )
        } catch (error) {
            failed += 1
            console.error(`[reindex] fail ${message.id}`, error)
        }
    }

    console.log(
        `\n[reindex] done - distilled=${distilled} skipped=${skipped} failed=${failed} batch=${batchId}`
    )
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
