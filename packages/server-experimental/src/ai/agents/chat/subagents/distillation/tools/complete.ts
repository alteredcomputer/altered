import { tool } from "ai"
import { type } from "arktype"

/**
 * @remarks Intentionally has no execute body - calling it ends the agent loop (see the AI SDK loop-control docs on forced tool calling).
 *
 * @todo P2: Re-attempt an optional `error: { message, cause }` field. Both it and the earlier `summary` field were fabricated on every call (invented failure narratives on successful chunks), so failures are read from tool errors and the step guard instead. Retry once the loop is stable, or gate it behind a required outcome discriminator.
 */
const createCompleteTool = () =>
    tool({
        title: "Complete",
        description:
            "Finish this chunk. Call once every eligible point is distilled - or immediately if nothing new remains.",

        type: "function",
        strict: true,

        inputSchema: type({})
    })

export { createCompleteTool }
