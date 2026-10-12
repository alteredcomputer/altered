import { readGit } from "../utils/read-git"

function readGitCommitMessageTrailer({
    commitObjectId,

    trailerKey
}: {
    commitObjectId: string

    trailerKey: string
}): string | null {
    const trailerValues = readGit([
        "log",
        "--max-count=1",
        `--format=%(trailers:key=${trailerKey},valueonly,unfold)`,

        commitObjectId
    ])

    const [trailerValue] = trailerValues.split("\n")

    if (!trailerValue?.trim()) return null

    return trailerValue
}

export { readGitCommitMessageTrailer }
