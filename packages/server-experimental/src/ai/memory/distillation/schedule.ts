import { distillChatMessage } from "./run-for-chat-message"

type ScheduleDistillationOptions = {
    indexKeywords?: boolean

    /**
     * @todo P1: Plumb Vercel `waitUntil` from the webhook entry so serverless
     * runtimes keep the job alive after the HTTP response.
     */
    waitUntil?: (promise: Promise<unknown>) => void
}

/**
 * Fire-and-forget distillation after a chat message is saved.
 *
 * @remarks Failures are logged only — the chat reply must not block on this.
 */
const scheduleDistillationForMessage = (
    messageId: string,
    options: ScheduleDistillationOptions = {}
): void => {
    const promise = distillChatMessage({
        messageId,
        persist: true,
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

    options.waitUntil?.(promise)
}

export { type ScheduleDistillationOptions, scheduleDistillationForMessage }
