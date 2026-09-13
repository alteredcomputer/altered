/**
 * The data that outlives the certification CLI.
 *
 * @remarks Git runs `pre-commit` and `commit-msg` as separate processes, and only the second one can touch the message, so the certification has to land on disk in between.
 */
type CertificationState = {
    reasoning: string

    signature: string
}

export type { CertificationState }
