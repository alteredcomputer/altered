import type { Root } from "mdast"
import { MarkdownRendererNode } from "./node"

function MarkdownRenderer({ ast }: { ast: Root }) {
    return <MarkdownRendererNode ast={ast} />
}

export { MarkdownRenderer }
