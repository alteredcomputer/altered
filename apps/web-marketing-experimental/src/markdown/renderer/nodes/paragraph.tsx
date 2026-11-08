import type { Paragraph } from "mdast"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownParagraphNode(
    ast: Paragraph,
    context: MarkdownRendererNodeContext
) {
    return (
        <p className="text-pretty">{renderMarkdownChildNodes(ast, context)}</p>
    )
}

export { renderMarkdownParagraphNode }
