import { getGitCommitAmendDiffBaseObjectId } from "./get-amend-diff-base"
import { readGit } from "./read-git"

function getGitDiffFilePaths({
    includeLastCommit
}: {
    /**
     * @remarks
     * - Useful for aggregating the result of an amended commit.
     * - This creates a diff against the parent of the last commit.
     * - The result will contain both the staged changes and the changes in the last commit.
     */
    includeLastCommit: boolean
}): string[] {
    const gitDiffArguments = ["diff", "--cached", "--name-only"]

    if (includeLastCommit) {
        const baseObjectId = getGitCommitAmendDiffBaseObjectId()

        gitDiffArguments.push(baseObjectId)
    }

    const resolvedFilePaths = readGit(gitDiffArguments)
        .split("\n")
        .filter(Boolean)

    return resolvedFilePaths
}

export { getGitDiffFilePaths }
