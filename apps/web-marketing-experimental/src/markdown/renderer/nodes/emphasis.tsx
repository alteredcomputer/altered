import type { Emphasis } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownEmphasisNode(ast: Emphasis) {
    return (
        <>
            <MarkdownDecorativeGlyph>{"*"}</MarkdownDecorativeGlyph>

            <em>{renderMarkdownChildNodes(ast)}</em>

            <MarkdownDecorativeGlyph>{"*"}</MarkdownDecorativeGlyph>
        </>
    )
}

export { renderMarkdownEmphasisNode }
