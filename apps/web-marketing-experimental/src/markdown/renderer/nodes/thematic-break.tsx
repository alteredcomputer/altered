import type { ThematicBreak } from "mdast"

function renderMarkdownThematicBreakNode(_ast: ThematicBreak) {
    return (
        <p
            aria-hidden="true"
            className="text-foreground/48-64 not-first:pt-line"
        >
            {"---"}
        </p>
    )
}

export { renderMarkdownThematicBreakNode }
