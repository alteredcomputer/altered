import { getGitDiffFilePaths } from "./get-commit-paths"
import { isAmendingCommit } from "./is-amending-commit"
import { readGit } from "./read-git"

type GitCommitContext = {
    /**
     * @remarks `null` when `HEAD` is detached, such as while resolving a rebase.
     */
    branch: string | null

    /**
     * Every file change path that the resulting commit will contain.
     *
     * @remarks This includes the staged changes and the changes in the last commit.
     */
    filePaths: string[]

    isAmending: boolean

    /**
     * True when no message-related arguments are passed.
     */
    willOpenMessageEditor: boolean
}

function getGitCommitContext({
    gitProcessId
}: {
    gitProcessId: string
}): GitCommitContext {
    const isAmending = isAmendingCommit({ gitProcessId })

    return {
        branch: readGit(["branch", "--show-current"]) || null,

        filePaths: getGitDiffFilePaths({
            includeLastCommit: isAmending
        }),

        isAmending,

        willOpenMessageEditor: process.env.GIT_EDITOR !== ":"
    }
}

export { type GitCommitContext, getGitCommitContext }
