import type { Break } from "mdast"

function renderMarkdownBreakNode(_ast: Break) {
    return <br />
}

export { renderMarkdownBreakNode }
