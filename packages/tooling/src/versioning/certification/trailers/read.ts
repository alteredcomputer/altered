import { readGit } from "../utils/read-git"

function readCommitMessageTrailer({
    messageFilePath,

    trailerKey
}: {
    messageFilePath: string

    trailerKey: string
}): string | null {
    const trailerPrefix = `${trailerKey}: `

    const trailers = readGit(["interpret-trailers", "--parse", messageFilePath])

    const trailer = trailers
        .split("\n")
        .find(trailer => trailer.startsWith(trailerPrefix))

    if (!trailer) return null

    return trailer.slice(trailerPrefix.length)
}

export { readCommitMessageTrailer }
