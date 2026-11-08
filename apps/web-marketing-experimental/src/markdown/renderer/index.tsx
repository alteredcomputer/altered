import type { Root } from "mdast"
import { MarkdownRendererNode } from "./nodes"

function MarkdownRenderer({ ast }: { ast: Root }) {
    return <MarkdownRendererNode ast={ast} />
}

export { MarkdownRenderer }
