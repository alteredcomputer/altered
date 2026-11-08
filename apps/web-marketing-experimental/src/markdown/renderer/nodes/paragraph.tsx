import type { Paragraph } from "mdast"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownParagraphNode(ast: Paragraph) {
    return <p className="text-pretty">{renderMarkdownChildNodes(ast)}</p>
}

export { renderMarkdownParagraphNode }
