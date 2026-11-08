import type { Strong } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownStrongNode(ast: Strong) {
    return (
        <>
            <MarkdownDecorativeGlyph>{"**"}</MarkdownDecorativeGlyph>

            <strong className="font-bold text-foreground">
                {renderMarkdownChildNodes(ast)}
            </strong>

            <MarkdownDecorativeGlyph>{"**"}</MarkdownDecorativeGlyph>
        </>
    )
}

export { renderMarkdownStrongNode }
