import { readGit } from "./read-git"

type GitDiffFileChange = {
    /**
     * Git's single-letter status, such as `A`, `M`, or `D`.
     */
    statusLetter: string

    path: string
}

/**
 * @remarks
 * - File renames are split into their individual changes (an addition and a deletion).
 * - Git output is NUL-separated (`\0`) with the `-z` flag so that paths with unicode or special characters are returned raw, rather than quoted and escaped.
 */
function getGitDiffFileChanges({
    diffArguments
}: {
    diffArguments: string[]
}): GitDiffFileChange[] {
    const fields = readGit([
        "diff",
        "-z",
        "--name-status",
        "--no-renames",

        ...diffArguments
    ])
        .split("\0")
        .filter(Boolean)

    const fileChanges: GitDiffFileChange[] = []

    for (let index = 0; index < fields.length; index += 2) {
        const [statusLetter, path] = [fields[index], fields[index + 1]]

        if (statusLetter && path) fileChanges.push({ statusLetter, path })
    }

    return fileChanges
}

export { type GitDiffFileChange, getGitDiffFileChanges }
