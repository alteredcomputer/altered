import type { Text } from "mdast"

function renderMarkdownTextNode(ast: Text) {
    return ast.value
}

export { renderMarkdownTextNode }
