import { type } from "arktype"
import type { FetchPreviousSource } from "../source/previous"

type DistillationToolOptions = {
    fetchPreviousSource?: FetchPreviousSource

    /**
     * Requires a short "thinking" line on record/update calls for debugging.
     *
     * @remarks Conditionally excluded to save tokens when not debugging.
     */
    includeThinking?: boolean
}

const thinkingProperty = type("string").describe(
    "One short line on why the thought is shaped the way it is."
)

export { type DistillationToolOptions, thinkingProperty }
