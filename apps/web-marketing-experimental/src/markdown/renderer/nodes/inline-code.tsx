import type { InlineCode } from "mdast"
import { MarkdownInlineCode } from "../components/inline-code"

function renderMarkdownInlineCodeNode(ast: InlineCode) {
    return <MarkdownInlineCode>{ast.value}</MarkdownInlineCode>
}

export { renderMarkdownInlineCodeNode }
