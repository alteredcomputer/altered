import { getEnvironmentConfig } from "@altered/core-experimental/config/environment/definitions"
import { resolveApiOrigin } from "@altered/core-experimental/config/routing"
import { distillChatMessage } from "./run-for-chat-message"

type ScheduleDistillationOptions = {
    indexKeywords?: boolean
}

const JOB_SECRET_HEADER = "x-altered-job-secret" as const

/**
 * Dispatch distillation after a chat message is saved.
 *
 * @remarks Awaits the short HTTP accept from `POST /jobs/distill-message`
 * (job route returns immediately and runs distill under `waitUntil`).
 * See `.context/_generated/plans/distillation-job-dispatch.md`.
 *
 * @todo P2: Optionally put QStash in front of the job route for retries.
 */
const scheduleDistillationForMessage = async (
    messageId: string,
    options: ScheduleDistillationOptions = {}
): Promise<void> => {
    try {
        await enqueueDistillationJob({
            messageId,
            indexKeywords: options.indexKeywords ?? true
        })
    } catch (error) {
        console.error(`[distill] dispatch failed for ${messageId}`, error)
    }
}

/**
 * Worker entry for the job route (and any direct callers).
 */
const dispatchDistillationJob = (input: {
    messageId: string
    indexKeywords?: boolean
}) =>
    distillChatMessage({
        messageId: input.messageId,
        persist: true,
        indexKeywords: input.indexKeywords ?? true
    })

const enqueueDistillationJob = async (input: {
    messageId: string
    indexKeywords?: boolean
}): Promise<void> => {
    const secret = getEnvironmentConfig().shared.jobs.secret
    const origin = resolveApiOrigin({ target: "api" })
    const base = origin.endsWith("/") ? origin.slice(0, -1) : origin
    const url = `${base}/jobs/distill-message`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            [JOB_SECRET_HEADER]: secret
        },
        body: JSON.stringify({
            messageId: input.messageId,
            indexKeywords: input.indexKeywords
        })
    })

    if (!response.ok) {
        const detail = await response.text().catch(() => "")

        throw new Error(
            `Distill job HTTP ${response.status}${detail ? `: ${detail}` : ""}`
        )
    }

    console.log(`[distill] dispatched ${input.messageId} → ${url}`)
}

export {
    dispatchDistillationJob,
    type ScheduleDistillationOptions,
    scheduleDistillationForMessage
}
