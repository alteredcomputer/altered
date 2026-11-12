import type { Heading } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import { MarkdownLine, MarkdownLinePrefixGlyph } from "../components/line"
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

    const marker = ast.data?.marker ?? `${"#".repeat(ast.depth)} `

    /** @remarks A setext heading's marker is its underline (`===` or `---`), on the line below the text. */
    const isSetextHeading = !marker.startsWith("#")

    return (
        <MarkdownLine
            as={Tag}
            className="font-bold text-balance whitespace-pre-line text-foreground"
            linePrefix={context.linePrefix}
        >
            {isSetextHeading ? null : (
                <span className="whitespace-pre">
                    <MarkdownDecorativeGlyph>{marker}</MarkdownDecorativeGlyph>
                </span>
            )}

            {renderMarkdownChildNodes(ast, context)}

            {ast.data?.closingMarker ? (
                <span className="whitespace-pre">
                    <MarkdownDecorativeGlyph>
                        {ast.data.closingMarker}
                    </MarkdownDecorativeGlyph>
                </span>
            ) : null}

            {isSetextHeading ? (
                <>
                    {"\n"}
                    <MarkdownLinePrefixGlyph>
                        {context.linePrefix?.rest ?? ""}
                    </MarkdownLinePrefixGlyph>
                    <MarkdownDecorativeGlyph>{marker}</MarkdownDecorativeGlyph>
                </>
            ) : null}
        </MarkdownLine>
    )
}

export { renderMarkdownHeadingNode }
