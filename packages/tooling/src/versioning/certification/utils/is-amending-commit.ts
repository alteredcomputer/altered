import { execFileSync } from "node:child_process"
import { containsAmendFlag } from "./contains-amend-flag"

/**
 * @remarks
 * - Git doesn't tell hooks if a commit is being amended.
 * - Git process arguments come through as a single string, so a message containing `--amend` would give a false positive. The gate refuses those messages to keep this exact.
 * - Aliases that hide the flag, and abbreviations like `--amen`, produce false negatives.
 */
function isAmendingCommit({ gitProcessId }: { gitProcessId: string }): boolean {
    const gitProcessArguments = execFileSync(
        "ps",
        ["-o", "args=", "-p", gitProcessId],
        { encoding: "utf8" }
    )

    return containsAmendFlag(gitProcessArguments)
}

export { isAmendingCommit }
