import type { Emphasis, Strong } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownStrongEmphasisNode(
    ast: Strong | Emphasis,
    context: MarkdownRendererNodeContext
) {
    return (
        <strong className="font-bold text-foreground">
            <em>
                <MarkdownDecorativeGlyph>{"***"}</MarkdownDecorativeGlyph>

                {renderMarkdownChildNodes(ast, context)}

                <MarkdownDecorativeGlyph>{"***"}</MarkdownDecorativeGlyph>
            </em>
        </strong>
    )
}

export { renderMarkdownStrongEmphasisNode }
