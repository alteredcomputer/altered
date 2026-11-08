import type { Nodes } from "mdast"
import { MarkdownRendererNode } from "."

function renderMarkdownChildNodes(ast: { children: Nodes[] }) {
    return ast.children.map((child, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
        <MarkdownRendererNode ast={child} key={`${child.type}-${index}`} />
    ))
}

export { renderMarkdownChildNodes }
