import type { Nodes } from "mdast"
import type { MarkdownRendererNodeContext } from "./definitions"

function renderMarkdownChildNodes(
    ast: { children: Nodes[] },
    context: MarkdownRendererNodeContext
) {
    return ast.children.map((child, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
        <context.renderer ast={child} key={`${child.type}-${index}`} />
    ))
}

export { renderMarkdownChildNodes }
