import type { Heading } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

const astDepthToHtmlTagMap = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6"
} as const satisfies Record<Heading["depth"], string>

function renderMarkdownHeadingNode(
    ast: Heading,
    context: MarkdownRendererNodeContext
) {
    const Tag = astDepthToHtmlTagMap[ast.depth]

    return (
        <Tag className="font-bold text-balance text-foreground not-first:pt-line">
            <span className="shrink-0 whitespace-pre">
                <MarkdownDecorativeGlyph>
                    {"#".repeat(ast.depth)}
                </MarkdownDecorativeGlyph>{" "}
            </span>
            {renderMarkdownChildNodes(ast, context)}
        </Tag>
    )
}

export { renderMarkdownHeadingNode }
