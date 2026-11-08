import type { ThematicBreak } from "mdast"

function renderMarkdownThematicBreakNode(_ast: ThematicBreak) {
    return (
        <p aria-hidden="true" className="text-foreground/48-64">
            {"---"}
        </p>
    )
}

export { renderMarkdownThematicBreakNode }
