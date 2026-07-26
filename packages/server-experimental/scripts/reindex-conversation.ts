/**
 * Backfill distillation for messages in a conversation.
 *
 * @remarks Modes: `skip` (default) | `overwrite` | `duplicate`.
 * Window: `--from oldest|newest`, `--limit`, `--offset` / `--page`.
 * Parallelism: all messages by default; optional `--concurrency` cap.
 * 429s retry with exponential backoff (paid OpenRouter models are uncapped).
 *
 * @example
 * pnpm run:reindex-conversation -- --conversation-id <id> --from newest --limit 10 --mode skip --index
 * pnpm run:reindex-conversation -- --conversation-id <id> --concurrency 20
 */

import "dotenv/config"

import { parseArgs } from "node:util"
import { asc, eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { listDistilledChatMessageIds } from "../src/ai/memory/distillation/list-distilled-message-ids"
import { mapWithConcurrency } from "../src/ai/memory/distillation/map-with-concurrency"
import { distillChatMessage } from "../src/ai/memory/distillation/run-for-chat-message"
import {
    type MessageWindowFrom,
    selectMessageWindow
} from "../src/ai/memory/distillation/select-message-window"
import { withRateLimitRetry } from "../src/ai/memory/distillation/with-rate-limit-retry"
import type { ChatMessage } from "../src/chat/messages/schema"
import { chatMessages } from "../src/chat/messages/schema"
import { toPlainText } from "../src/chat/messages/to-plain-text"
import { deleteDerivedThoughtsForChatMessage } from "../src/models/thoughts/delete-derived-for-chat-message"
import { getDatabase } from "../src/storage/database/connection"

const REINDEX_MODES = ["skip", "overwrite", "duplicate"] as const
type ReindexMode = (typeof REINDEX_MODES)[number]

const WINDOW_FROM = ["oldest", "newest"] as const

const { values } = parseArgs({
    options: {
        "conversation-id": { type: "string" },
        mode: { type: "string", default: "skip" },
        index: { type: "boolean", default: false },
        from: { type: "string", default: "oldest" },
        limit: { type: "string" },
        offset: { type: "string" },
        page: { type: "string" },
        concurrency: { type: "string" },
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

const resolveFrom = (value: string | undefined): MessageWindowFrom => {
    if (value && WINDOW_FROM.includes(value as MessageWindowFrom))
        return value as MessageWindowFrom

    throw new Error(
        `Invalid --from. Expected one of: ${WINDOW_FROM.join(", ")}`
    )
}

const optionalPositiveInt = (
    value: string | undefined,
    flag: string
): number | undefined => {
    if (value === undefined) return

    const parsed = Number(value)

    if (!Number.isInteger(parsed))
        throw new Error(`${flag} must be an integer.`)

    return parsed
}

const parseCli = () => {
    const conversationId = values["conversation-id"]

    if (!conversationId) throw new Error("--conversation-id is required.")

    return {
        conversationId,
        mode: resolveMode(values.mode),
        from: resolveFrom(values.from),
        shouldIndex: values.index === true,
        dryRun: values["dry-run"] === true,
        limit: optionalPositiveInt(values.limit, "--limit"),
        offset: optionalPositiveInt(values.offset, "--offset"),
        page: optionalPositiveInt(values.page, "--page"),
        concurrency: optionalPositiveInt(values.concurrency, "--concurrency")
    }
}

const partitionWork = (
    selected: ChatMessage[],
    distilledIds: Set<string>,
    mode: ReindexMode,
    dryRun: boolean
): { work: ChatMessage[]; skipped: number } => {
    const work: ChatMessage[] = []
    let skipped = 0

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

        work.push(message)
    }

    return { work, skipped }
}

const reindexMessage = async (input: {
    message: ChatMessage
    mode: ReindexMode
    shouldIndex: boolean
    batchId: string
}): Promise<"distilled"> => {
    const { message, mode, shouldIndex, batchId } = input

    if (mode === "overwrite") {
        const deleted = await deleteDerivedThoughtsForChatMessage(message.id)

        if (deleted > 0)
            console.log(
                `[reindex] overwrite cleared ${deleted} thoughts for ${message.id}`
            )
    }

    const result = await withRateLimitRetry(
        () =>
            distillChatMessage({
                messageId: message.id,
                persist: true,
                indexKeywords: shouldIndex,
                batchId,
                log: true
            }),
        {
            onRetry: ({ attempt, maxAttempts, delayMs }) => {
                console.warn(
                    `[reindex] rate-limited ${message.id} - retry ${attempt}/${maxAttempts} in ${delayMs}ms`
                )
            }
        }
    )

    console.log(
        `[reindex] ok ${message.id} → ${result.thoughtCount} thoughts (${result.agentRunId})`
    )

    return "distilled"
}

const main = async () => {
    const cli = parseCli()
    const batchId = nanoid()
    const database = getDatabase()

    const messages = await database
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, cli.conversationId))
        .orderBy(asc(chatMessages.createdAt))

    const distilledIds = await listDistilledChatMessageIds(cli.conversationId)

    const candidates = messages.filter(
        message => toPlainText(message.content).trim().length > 0
    )

    const selected = selectMessageWindow(candidates, {
        from: cli.from,
        limit: cli.limit,
        offset: cli.offset,
        page: cli.page
    })

    const concurrencyLabel = cli.concurrency ?? "all"

    console.log(
        `[reindex] conversation ${cli.conversationId} - window ${selected.length}/${candidates.length} (from=${cli.from}, limit=${cli.limit ?? "∅"}, offset=${cli.offset ?? 0}, page=${cli.page ?? "∅"}), mode=${cli.mode}, concurrency=${concurrencyLabel}, batch=${batchId}${cli.dryRun ? " (dry-run)" : ""}`
    )

    const { work, skipped } = partitionWork(
        selected,
        distilledIds,
        cli.mode,
        cli.dryRun
    )

    if (cli.dryRun || work.length === 0) {
        console.log(
            `\n[reindex] done - distilled=0 skipped=${skipped} failed=0 batch=${batchId}`
        )

        return
    }

    const settled = await mapWithConcurrency(
        work,
        cli.concurrency,
        async message => {
            try {
                return await reindexMessage({
                    message,
                    mode: cli.mode,
                    shouldIndex: cli.shouldIndex,
                    batchId
                })
            } catch (error) {
                console.error(`[reindex] fail ${message.id}`, error)
                throw error
            }
        }
    )

    const distilled = settled.filter(
        result => result.status === "fulfilled"
    ).length
    const failed = settled.length - distilled

    console.log(
        `\n[reindex] done - distilled=${distilled} skipped=${skipped} failed=${failed} batch=${batchId}`
    )
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
