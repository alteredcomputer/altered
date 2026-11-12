import type { Emphasis, Strong } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

const defaultMarkerByNodeType = { emphasis: "*", strong: "**" } as const

function renderMarkdownStrongEmphasisNode(
    { outer, inner }: { outer: Strong | Emphasis; inner: Strong | Emphasis },
    context: MarkdownRendererNodeContext
) {
    const outerMarker =
        outer.data?.marker ?? defaultMarkerByNodeType[outer.type]
    const innerMarker =
        inner.data?.marker ?? defaultMarkerByNodeType[inner.type]

    return (
        <strong className="font-bold text-foreground">
            <em>
                <MarkdownDecorativeGlyph>
                    {outerMarker + innerMarker}
                </MarkdownDecorativeGlyph>

                {renderMarkdownChildNodes(inner, context)}

                <MarkdownDecorativeGlyph>
                    {innerMarker + outerMarker}
                </MarkdownDecorativeGlyph>
            </em>
        </strong>
    )
}

export { renderMarkdownStrongEmphasisNode }
