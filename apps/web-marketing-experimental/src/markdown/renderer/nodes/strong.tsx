import type { Strong } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"
import { renderMarkdownStrongEmphasisNode } from "./strong-emphasis"

function renderMarkdownStrongNode(
    ast: Strong,
    context: MarkdownRendererNodeContext
) {
    const [firstChild, ...otherChildren] = ast.children

    const isOnlyChild = otherChildren.length === 0
    const isChildEmphasis = firstChild?.type === "emphasis"

    if (isOnlyChild && isChildEmphasis)
        return renderMarkdownStrongEmphasisNode(firstChild, context)

    return (
        <strong className="font-bold text-foreground">
            <MarkdownDecorativeGlyph>{"**"}</MarkdownDecorativeGlyph>

            {renderMarkdownChildNodes(ast, context)}

            <MarkdownDecorativeGlyph>{"**"}</MarkdownDecorativeGlyph>
        </strong>
    )
}

export { renderMarkdownStrongNode }
