import type { Emphasis } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownEmphasisNode(
    ast: Emphasis,
    context: MarkdownRendererNodeContext
) {
    return (
        <em className="text-foreground/32-64">
            <MarkdownDecorativeGlyph>{"*"}</MarkdownDecorativeGlyph>

            {renderMarkdownChildNodes(ast, context)}

            <MarkdownDecorativeGlyph>{"*"}</MarkdownDecorativeGlyph>
        </em>
    )
}

export { renderMarkdownEmphasisNode }
