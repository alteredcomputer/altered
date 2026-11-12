import type { Paragraph } from "mdast"
import { MarkdownLine } from "../components/line"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownParagraphNode(
    ast: Paragraph,
    context: MarkdownRendererNodeContext
) {
    return (
        /* Not a `<p>`, which copies with an extra newline and would break copying the page as its markdown source. */
        <MarkdownLine
            className="text-pretty whitespace-pre-line"
            linePrefix={context.linePrefix}
            role="paragraph"
        >
            {renderMarkdownChildNodes(ast, context)}
        </MarkdownLine>
    )
}

export { renderMarkdownParagraphNode }
