import { readGit } from "./read-git"

type GitInformation = {
    branch: string

    stagedPaths: string[]
}

function getGitInfo(): GitInformation {
    return {
        branch: readGit(["rev-parse", "--abbrev-ref", "HEAD"]),

        stagedPaths: readGit(["diff", "--cached", "--name-only"])
            .split("\n")
            .filter(Boolean)
    }
}

export { type GitInformation, getGitInfo }
