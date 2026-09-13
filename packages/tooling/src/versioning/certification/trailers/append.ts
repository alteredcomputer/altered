import type { CertificationState } from "../state/definitions"
import { writeGit } from "../utils/write-git"
import {
    CERTIFICATION_REASONING_TRAILER_KEY,
    CERTIFICATION_SIGNATURE_TRAILER_KEY
} from "./definitions"

/**
 * Records the certification details inside the commit message as trailers.
 */
function appendCertificationTrailers({
    state,

    messagePath
}: {
    state: CertificationState

    messagePath: string
}): void {
    /**
     * @remarks Trailer values have to be a single line, so we collapse the reasoning.
     */
    const resolvedReasoning = state.reasoning.replaceAll(/\s+/g, " ").trim()

    writeGit([
        "interpret-trailers",
        "--in-place",
        "--trailer",
        `${CERTIFICATION_REASONING_TRAILER_KEY}: ${resolvedReasoning}`,
        "--trailer",
        `${CERTIFICATION_SIGNATURE_TRAILER_KEY}: ${state.signature}`,
        messagePath
    ])
}

export { appendCertificationTrailers }
