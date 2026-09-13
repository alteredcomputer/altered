import { join } from "node:path"
import { certificationConfig } from "../config"
import { readGit } from "./read-git"

/**
 * @remarks Resolved through Git rather than hardcoded to `.git`, which is a file and not a directory in linked worktrees.
 */
function getCertificationStatePath(): string {
    return join(
        readGit(["rev-parse", "--absolute-git-dir"]),
        certificationConfig.temporaryStateFileName
    )
}

export { getCertificationStatePath }
