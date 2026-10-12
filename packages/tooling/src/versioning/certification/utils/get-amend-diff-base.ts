import { readGit } from "./read-git"

/**
 * @remarks
 * - Targets the parent of the last commit.
 * - If it is the very first commit, we compare against the empty tree.
 */
function getGitCommitAmendDiffBaseObjectId(): string {
    const [, parentCommitObjectId = null] = readGit([
        "rev-list",
        "--parents",
        "--max-count=1",
        "HEAD"
    ]).split(" ")

    if (parentCommitObjectId !== null) return parentCommitObjectId

    const emptyTreeObjectId = readGit([
        "hash-object",
        "-t",
        "tree",
        "/dev/null"
    ])

    return emptyTreeObjectId
}

export { getGitCommitAmendDiffBaseObjectId }
