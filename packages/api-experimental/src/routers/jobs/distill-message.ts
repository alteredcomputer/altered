import { getEnvironmentConfig } from "@altered/core-experimental/config/environment/definitions"
import { dispatchDistillationJob } from "@altered/server-experimental/ai/memory/distillation/schedule"
import { waitUntil } from "@vercel/functions"
import { type } from "arktype"
import { Hono } from "hono"

const distillMessageJobBodySchema = type({
    messageId: "string > 0",
    "indexKeywords?": "boolean"
})

const app = new Hono()

/**
 * Internal worker for chat-message distillation.
 *
 * @remarks Authenticate with `x-altered-job-secret`. Returns 200 immediately,
 * then finishes the distill loop under `waitUntil` within this job invocation
 * (Fluid Compute `maxDuration`). See `distillation-job-dispatch.md`.
 */
app.post("/", async context => {
    const expectedSecret = getEnvironmentConfig().shared.jobs.secret
    const providedSecret = context.req.header("x-altered-job-secret")

    if (providedSecret !== expectedSecret)
        return context.json({ error: "Unauthorized." }, 401)

    const body = distillMessageJobBodySchema(await context.req.json())

    if (body instanceof type.errors)
        return context.json({ error: body.summary }, 400)

    waitUntil(
        dispatchDistillationJob({
            messageId: body.messageId,
            indexKeywords: body.indexKeywords
        })
            .then(result => {
                console.log(
                    `[jobs/distill-message] ${body.messageId}: ${result.thoughtCount} thoughts (${result.agentRunId ?? "no-run"})`
                )
            })
            .catch(error => {
                console.error(
                    `[jobs/distill-message] failed for ${body.messageId}`,
                    error
                )
            })
    )

    return context.json({ accepted: true, messageId: body.messageId }, 200)
})

export { app as distillMessageJobRouter }
