import type { Emphasis } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"
import { renderMarkdownStrongEmphasisNode } from "./strong-emphasis"

function renderMarkdownEmphasisNode(
    ast: Emphasis,
    context: MarkdownRendererNodeContext
) {
    const [firstChild, ...otherChildren] = ast.children

    const isOnlyChild = otherChildren.length === 0
    const isChildStrong = firstChild?.type === "strong"

    if (isOnlyChild && isChildStrong)
        return renderMarkdownStrongEmphasisNode(firstChild, context)

    return (
        <em className="text-foreground/32-64">
            <MarkdownDecorativeGlyph>{"*"}</MarkdownDecorativeGlyph>

            {renderMarkdownChildNodes(ast, context)}

            <MarkdownDecorativeGlyph>{"*"}</MarkdownDecorativeGlyph>
        </em>
    )
}

export { renderMarkdownEmphasisNode }
