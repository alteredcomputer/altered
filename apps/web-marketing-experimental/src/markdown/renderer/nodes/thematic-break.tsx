import type { ThematicBreak } from "mdast"
import { MarkdownLine } from "../components/line"
import type { MarkdownRendererNodeContext } from "./definitions"

function renderMarkdownThematicBreakNode(
    ast: ThematicBreak,
    context: MarkdownRendererNodeContext
) {
    return (
        <MarkdownLine
            aria-hidden="true"
            className="text-foreground/48-64"
            linePrefix={context.linePrefix}
        >
            {ast.data?.marker ?? "---"}
        </MarkdownLine>
    )
}

export { renderMarkdownThematicBreakNode }
