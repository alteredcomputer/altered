import type { Blockquote } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownBlockquoteNode(
    ast: Blockquote,
    context: MarkdownRendererNodeContext
) {
    return (
        <blockquote className="grid gap-line">
            {ast.children.map((child, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                <p key={`${child.type}-${index}`}>
                    <MarkdownDecorativeGlyph>{"> "}</MarkdownDecorativeGlyph>

                    {child.type === "paragraph" ? (
                        renderMarkdownChildNodes(child, context)
                    ) : (
                        <context.renderer ast={child} />
                    )}
                </p>
            ))}
        </blockquote>
    )
}

export { renderMarkdownBlockquoteNode }
