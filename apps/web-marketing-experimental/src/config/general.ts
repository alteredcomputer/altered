/**
 * @todo P2 For all that are appropriate, convert to environment variables once repository structure is stable.
 */

const BASE_URL = "https://altered.computer"

/** @remarks Temporary toggles to compare looks. The wrapped line indent continues wrapped lines after their line's prefix (a list marker, `> `, or a code line's own indentation) instead of at the left edge. */
const IS_MARKDOWN_WRAPPED_LINE_INDENT_ENABLED = true as boolean
const IS_MARKDOWN_CODE_BLOCK_PADDING_ENABLED = true as boolean

/** @remarks Temporarily off to review the render without the rules' opinions. */
const IS_MARKDOWN_TRANSFORM_RULES_ENABLED = false as boolean

export {
    BASE_URL,
    IS_MARKDOWN_CODE_BLOCK_PADDING_ENABLED,
    IS_MARKDOWN_TRANSFORM_RULES_ENABLED,
    IS_MARKDOWN_WRAPPED_LINE_INDENT_ENABLED
}
