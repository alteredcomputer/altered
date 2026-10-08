#!/usr/bin/env tsx

import { CERTIFICATION_REASONING_TRAILER_KEY } from "../../../src/versioning/certification/trailers/definitions"
import { readCommitMessageTrailer } from "../../../src/versioning/certification/trailers/read"
import { writeCommitCertificationMessageTrailers } from "../../../src/versioning/certification/trailers/write"
import { getCommitContext } from "../../../src/versioning/certification/utils/get-commit-context"
import { runCommitCertification } from "../../../src/versioning/commits/certify"

const [gitCommitMessagePath, gitCommitMessageOperationType] =
    process.argv.slice(2)

if (!gitCommitMessagePath)
    throw new Error(
        "Expected a commit message file path as the first argument."
    )

const { branch, stagedPaths } = getCommitContext()

/**
 * @todo P0: Consider whether this amend logic needs to be improved.
 */
const isAmending = gitCommitMessageOperationType === "commit"

const previousCertificationReasoning = readCommitMessageTrailer({
    messageFilePath: gitCommitMessagePath,
    trailerKey: CERTIFICATION_REASONING_TRAILER_KEY
})

const certificationResult = await runCommitCertification({
    context: {
        branch,
        stagedPaths,

        isAmending,

        previousCertificationReasoning
    }
})

//  @todo P3: Could be improved to return an error/result type rather than null, but fine for now.

if (!certificationResult) process.exit(1)

const { reasoning, signature } = certificationResult

writeCommitCertificationMessageTrailers({
    messageFilePath: gitCommitMessagePath,

    values: { reasoning, signature }
})
