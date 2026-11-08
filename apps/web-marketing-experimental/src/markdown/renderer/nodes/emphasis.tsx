import type { Emphasis } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownEmphasisNode(
    ast: Emphasis,
    context: MarkdownRendererNodeContext
) {
    return (
        <>
            <MarkdownDecorativeGlyph>{"*"}</MarkdownDecorativeGlyph>

            <em>{renderMarkdownChildNodes(ast, context)}</em>

            <MarkdownDecorativeGlyph>{"*"}</MarkdownDecorativeGlyph>
        </>
    )
}

export { renderMarkdownEmphasisNode }
