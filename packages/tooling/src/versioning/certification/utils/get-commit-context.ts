import { readGit } from "./read-git"

type CommitContext = {
    branch: string

    stagedPaths: string[]
}

function getCommitContext(): CommitContext {
    return {
        branch: readGit(["rev-parse", "--abbrev-ref", "HEAD"]),

        stagedPaths: readGit(["diff", "--cached", "--name-only"])
            .split("\n")
            .filter(Boolean)
    }
}

export { type CommitContext, getCommitContext }
