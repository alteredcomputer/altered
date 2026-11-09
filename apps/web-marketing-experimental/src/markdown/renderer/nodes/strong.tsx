import type { Strong } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownStrongNode(
    ast: Strong,
    context: MarkdownRendererNodeContext
) {
    return (
        <strong className="font-bold text-foreground">
            <MarkdownDecorativeGlyph>{"**"}</MarkdownDecorativeGlyph>

            {renderMarkdownChildNodes(ast, context)}

            <MarkdownDecorativeGlyph>{"**"}</MarkdownDecorativeGlyph>
        </strong>
    )
}

export { renderMarkdownStrongNode }
