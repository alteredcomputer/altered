#!/usr/bin/env tsx

import { clearCertificationState } from "../src/versioning/certification/state/clear"
import { readCertificationState } from "../src/versioning/certification/state/read"
import { appendCertificationTrailers } from "../src/versioning/certification/trailers/append"

const [firstCliArgument] = process.argv.slice(2)

if (!firstCliArgument)
    throw new Error(
        "Expected a commit message file path as the first argument."
    )

const certificationState = readCertificationState()
if (!certificationState) process.exit(0)

appendCertificationTrailers({
    state: certificationState,

    messagePath: firstCliArgument
})

clearCertificationState()
