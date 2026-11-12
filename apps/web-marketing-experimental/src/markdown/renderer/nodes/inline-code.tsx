import type { InlineCode } from "mdast"
import { MarkdownInlineCode } from "../components/inline-code"

function renderMarkdownInlineCodeNode(ast: InlineCode) {
    return <MarkdownInlineCode marker={ast.data?.marker} value={ast.value} />
}

export { renderMarkdownInlineCodeNode }
