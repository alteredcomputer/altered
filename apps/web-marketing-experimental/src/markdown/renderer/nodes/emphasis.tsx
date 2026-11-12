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
        return renderMarkdownStrongEmphasisNode(
            { outer: ast, inner: firstChild },
            context
        )

    const marker = ast.data?.marker ?? "*"

    return (
        <em className="text-foreground/32-64 in-[strong]:text-foreground">
            <MarkdownDecorativeGlyph>{marker}</MarkdownDecorativeGlyph>

            {renderMarkdownChildNodes(ast, context)}

            <MarkdownDecorativeGlyph>{marker}</MarkdownDecorativeGlyph>
        </em>
    )
}

export { renderMarkdownEmphasisNode }
