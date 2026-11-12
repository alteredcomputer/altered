import type { Html } from "mdast"
import { MarkdownLine, MarkdownLinePrefixGlyph } from "../components/line"
import type { MarkdownRendererNodeContext } from "./definitions"

/** @remarks HTML is shown as written, never run. A block is its own lines, and anything else sits inline. */
function renderMarkdownHtmlNode(
    ast: Html,
    context: MarkdownRendererNodeContext,
    { isBlock }: { isBlock: boolean }
) {
    if (!isBlock)
        return <span className="text-foreground/32-64">{ast.value}</span>

    return (
        <MarkdownLine
            className="text-foreground/32-64 whitespace-break-spaces"
            linePrefix={context.linePrefix}
        >
            {ast.value.split("\n").map((line, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                <span key={index}>
                    {index > 0 ? (
                        <>
                            {"\n"}
                            <MarkdownLinePrefixGlyph>
                                {context.linePrefix?.rest ?? ""}
                            </MarkdownLinePrefixGlyph>
                        </>
                    ) : null}
                    {line}
                </span>
            ))}
        </MarkdownLine>
    )
}

export { renderMarkdownHtmlNode }
