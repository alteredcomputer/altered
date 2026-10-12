import { execFileSync } from "node:child_process"

/**
 * @remarks
 * - Git doesn't tell hooks if a commit is being amended.
 * - Git process arguments come through as a single string, so a message containing `--amend` will give a false positive, and aliases for that flag will produce false negatives.
 */
function isAmendingCommit({ gitProcessId }: { gitProcessId: string }): boolean {
    const gitProcessArguments = execFileSync(
        "ps",
        ["-o", "args=", "-p", gitProcessId],
        { encoding: "utf8" }
    )

    const resolvedArguments = gitProcessArguments.trim().split(" ")

    const isAmending = resolvedArguments.includes("--amend")

    return isAmending
}

export { isAmendingCommit }
