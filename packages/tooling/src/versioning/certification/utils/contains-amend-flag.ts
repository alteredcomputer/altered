const WHITESPACE_PATTERN = /\s+/

const GIT_AMEND_FLAG = "--amend"

/**
 * @remarks Matches standalone tokens only, so `--amend` inside a longer token such as `--message=--amend` doesn't count.
 */
function containsAmendFlag(text: string): boolean {
    return text.trim().split(WHITESPACE_PATTERN).includes(GIT_AMEND_FLAG)
}

export { containsAmendFlag }
