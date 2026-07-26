import { distillChatMessage } from "./run-for-chat-message"

type ScheduleDistillationOptions = {
    indexKeywords?: boolean
}

/**
 * Dispatch distillation after a chat message is saved.
 *
 * @remarks Today this still runs in-process (fire-and-forget). That is a stopgap —
 * not the intended architecture. See `.context/_generated/plans/distillation-job-dispatch.md`.
 *
 * @todo P1: Dispatch via authenticated internal Hono job route (Fluid Compute
 * long `maxDuration`) with fire-and-forget `fetch`. Do not use `waitUntil` /
 * `afterResponse` as the job runner — those only extend the current request.
 *
 * @todo P2: Optionally put QStash in front of that route for retries / delivery
 * guarantees. Defer Trigger.dev / Upstash Workflows until multi-step durable
 * orchestration is actually needed.
 *
 * @todo P1: Feature-flag on-save distill before production traffic burns cost.
 */
const scheduleDistillationForMessage = (
    messageId: string,
    options: ScheduleDistillationOptions = {}
): void => {
    void dispatchDistillationJob({
        messageId,
        indexKeywords: options.indexKeywords ?? true
    })
        .then(result => {
            console.log(
                `[distill] ${messageId}: ${result.thoughtCount} thoughts (${result.agentRunId ?? "no-run"})`
            )
        })
        .catch(error => {
            console.error(`[distill] failed for ${messageId}`, error)
        })
}

/**
 * Worker entry used by the future job route (and today's in-process fallback).
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

export {
    dispatchDistillationJob,
    type ScheduleDistillationOptions,
    scheduleDistillationForMessage
}
