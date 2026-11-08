import type { Strong } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownStrongNode(
    ast: Strong,
    context: MarkdownRendererNodeContext
) {
    return (
        <>
            <MarkdownDecorativeGlyph>{"**"}</MarkdownDecorativeGlyph>

            <strong className="font-bold text-foreground">
                {renderMarkdownChildNodes(ast, context)}
            </strong>

            <MarkdownDecorativeGlyph>{"**"}</MarkdownDecorativeGlyph>
        </>
    )
}

export { renderMarkdownStrongNode }
