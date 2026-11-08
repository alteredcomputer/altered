import type { Nodes } from "mdast"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownDefaultNode(
    ast: Nodes,
    context: MarkdownRendererNodeContext
) {
    return "children" in ast ? renderMarkdownChildNodes(ast, context) : null
}

export { renderMarkdownDefaultNode }
