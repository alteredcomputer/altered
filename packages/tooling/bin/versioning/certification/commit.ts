#!/usr/bin/env tsx

import { CERTIFICATION_REASONING_TRAILER_KEY } from "../../../src/versioning/certification/trailers/definitions"
import { readGitCommitMessageTrailer } from "../../../src/versioning/certification/trailers/read"
import { writeCommitCertificationMessageTrailers } from "../../../src/versioning/certification/trailers/write"
import { getGitCommitContext } from "../../../src/versioning/certification/utils/get-commit-context"
import { runCommitCertification } from "../../../src/versioning/commits/certify"

const [gitCommitMessageFilePath, gitProcessId] = process.argv.slice(2)

if (!gitCommitMessageFilePath || !gitProcessId)
    throw new Error(
        "Expected a commit message file path and a Git process ID as arguments."
    )

const commitContext = getGitCommitContext({
    gitProcessId,

    messageFilePath: gitCommitMessageFilePath
})

const previousCertificationReasoning = commitContext.isAmending
    ? readGitCommitMessageTrailer({
          commitObjectId: "HEAD",
          trailerKey: CERTIFICATION_REASONING_TRAILER_KEY
      })
    : null

const certificationResult = await runCommitCertification({
    context: {
        ...commitContext,

        previousCertificationReasoning
    }
})

//  @todo P3: Could be improved to return an error/result type rather than null, but fine for now.

if (!certificationResult) process.exit(1)

const { reasoning, signature } = certificationResult

writeCommitCertificationMessageTrailers({
    messageFilePath: gitCommitMessageFilePath,

    values: { reasoning, signature }
})
