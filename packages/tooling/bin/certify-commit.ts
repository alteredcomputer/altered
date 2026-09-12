#!/usr/bin/env tsx

import { getGitInfo } from "../src/versioning/certification/utils/get-git-info"
import { runCommitCertification } from "../src/versioning/commits/certify"

const gitInfo = getGitInfo()
const certificationResult = await runCommitCertification({ git: gitInfo })

if (!certificationResult) process.exit(1)
