import type { Nodes } from "mdast"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownDefaultNode(ast: Nodes) {
    return "children" in ast ? renderMarkdownChildNodes(ast) : null
}

export { renderMarkdownDefaultNode }
