import type { Delete } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

/** @remarks The markers sit outside `<del>`, so they aren't struck through. */
function renderMarkdownDeleteNode(
    ast: Delete,
    context: MarkdownRendererNodeContext
) {
    const marker = ast.data?.marker ?? "~~"

    return (
        <>
            <MarkdownDecorativeGlyph>{marker}</MarkdownDecorativeGlyph>
            <del>{renderMarkdownChildNodes(ast, context)}</del>
            <MarkdownDecorativeGlyph>{marker}</MarkdownDecorativeGlyph>
        </>
    )
}

export { renderMarkdownDeleteNode }
