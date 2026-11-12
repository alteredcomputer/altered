import type { Blockquote } from "mdast"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownContainerChildNodes } from "./render-child-node"

function renderMarkdownBlockquoteNode(
    ast: Blockquote,
    context: MarkdownRendererNodeContext
) {
    /** @remarks The first line keeps the source's marker, e.g. `>   `, and every other line uses `> `. */
    return (
        <blockquote>
            {renderMarkdownContainerChildNodes(ast, context, {
                marker: ast.data?.marker ?? "> ",
                continuation: "> "
            })}
        </blockquote>
    )
}

export { renderMarkdownBlockquoteNode }
