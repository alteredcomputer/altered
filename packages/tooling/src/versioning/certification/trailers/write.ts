import { writeGit } from "../utils/write-git"
import {
    CERTIFICATION_REASONING_TRAILER_KEY,
    CERTIFICATION_SIGNATURE_TRAILER_KEY
} from "./definitions"
import { removeCommitCertificationMessageTrailers } from "./remove"

function writeCommitCertificationMessageTrailers({
    messageFilePath,

    values
}: {
    messageFilePath: string

    values: {
        reasoning: string
        signature: string
    }
}): void {
    /**
     * @remarks Trailer values must be a single line, so we collapse any whitespace characters to a single space.
     */
    const resolvedReasoning = values.reasoning.replaceAll(/\s+/g, " ").trim()

    removeCommitCertificationMessageTrailers({ messageFilePath })

    writeGit([
        "interpret-trailers",
        "--in-place",
        "--trailer",
        `${CERTIFICATION_REASONING_TRAILER_KEY}: ${resolvedReasoning}`,
        "--trailer",
        `${CERTIFICATION_SIGNATURE_TRAILER_KEY}: ${values.signature}`,
        messageFilePath
    ])
}

export { writeCommitCertificationMessageTrailers }
