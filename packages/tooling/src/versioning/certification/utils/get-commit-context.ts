import { readFileSync } from "node:fs"
import { containsAmendFlag } from "./contains-amend-flag"
import { getGitCommitAmendDiffBaseObjectId } from "./get-amend-diff-base"
import {
    type GitDiffFileChange,
    getGitDiffFileChanges
} from "./get-diff-file-changes"
import { isAmendingCommit } from "./is-amending-commit"
import { readGit } from "./read-git"

type GitCommitAmendFileChanges = {
    /**
     * The changes in the commit being amended.
     */
    existing: GitDiffFileChange[]

    /**
     * Every change that the rewritten commit will contain.
     *
     * @remarks Changes that the amend reverts drop out of this list, but still appear in `existing`.
     */
    resulting: GitDiffFileChange[]
}

type GitCommitContext = {
    /**
     * @remarks `null` when `HEAD` is detached, such as while resolving a rebase.
     */
    branch: string | null

    /**
     * @remarks When amending, these are the amended changes on top of the existing commit.
     */
    stagedFileChanges: GitDiffFileChange[]

    isAmending: boolean

    /**
     * @remarks `null` unless amending.
     */
    amendFileChanges: GitCommitAmendFileChanges | null

    /**
     * True when no message-related arguments are passed.
     */
    willOpenMessageEditor: boolean

    /**
     * @remarks Refused by the gate, since it would make amend detection ambiguous.
     */
    messageContainsAmendFlag: boolean
}

function getGitCommitContext({
    gitProcessId,
    messageFilePath
}: {
    gitProcessId: string
    messageFilePath: string
}): GitCommitContext {
    const isAmending = isAmendingCommit({ gitProcessId })

    const amendDiffBaseObjectId = isAmending
        ? getGitCommitAmendDiffBaseObjectId()
        : null

    const amendFileChanges = amendDiffBaseObjectId
        ? {
              existing: getGitDiffFileChanges({
                  diffArguments: [amendDiffBaseObjectId, "HEAD"]
              }),

              resulting: getGitDiffFileChanges({
                  diffArguments: ["--cached", amendDiffBaseObjectId]
              })
          }
        : null

    return {
        branch: readGit(["branch", "--show-current"]) || null,

        stagedFileChanges: getGitDiffFileChanges({
            diffArguments: ["--cached"]
        }),

        amendFileChanges,

        isAmending,

        willOpenMessageEditor: process.env.GIT_EDITOR !== ":",

        messageContainsAmendFlag: containsAmendFlag(
            readFileSync(messageFilePath, "utf8")
        )
    }
}

export {
    type GitCommitAmendFileChanges,
    type GitCommitContext,
    getGitCommitContext
}
