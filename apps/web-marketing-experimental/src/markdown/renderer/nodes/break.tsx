import type { Break } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import { MarkdownLinePrefixGlyph } from "../components/line"
import type { MarkdownRendererNodeContext } from "./definitions"

/** @remarks The marker is `\` or the trailing spaces, kept with `pre-wrap` since the paragraph's `pre-line` would drop spaces before a line break. The next line starts with the containers' prefix. */
function renderMarkdownBreakNode(
    ast: Break,
    context: MarkdownRendererNodeContext
) {
    return (
        <>
            {ast.data?.marker ? (
                <span className="whitespace-pre-wrap">
                    <MarkdownDecorativeGlyph>
                        {ast.data.marker}
                    </MarkdownDecorativeGlyph>
                </span>
            ) : null}
            <br />
            <MarkdownLinePrefixGlyph>
                {context.linePrefix?.rest ?? ""}
            </MarkdownLinePrefixGlyph>
        </>
    )
}

export { renderMarkdownBreakNode }
