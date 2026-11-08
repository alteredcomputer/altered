import type { Nodes } from "mdast"
import type { ReactNode } from "react"
import { renderMarkdownBlockquoteNode } from "./blockquote"
import { renderMarkdownBreakNode } from "./break"
import { renderMarkdownDefaultNode } from "./default"
import { renderMarkdownEmphasisNode } from "./emphasis"
import { renderMarkdownHeadingNode } from "./heading"
import { renderMarkdownInlineCodeNode } from "./inline-code"
import { renderMarkdownLinkNode } from "./link"
import { renderMarkdownListNode } from "./list"
import { renderMarkdownParagraphNode } from "./paragraph"
import { renderMarkdownChildNodes } from "./render-child-node"
import { renderMarkdownStrongNode } from "./strong"
import { renderMarkdownTextNode } from "./text"
import { renderMarkdownThematicBreakNode } from "./thematic-break"
import { renderMarkdownYamlNode } from "./yaml"

function MarkdownRendererNode({ ast }: { ast: Nodes }): ReactNode {
    switch (ast.type) {
        case "root":
            return renderMarkdownChildNodes(ast)

        case "yaml":
            return renderMarkdownYamlNode(ast)

        case "heading":
            return renderMarkdownHeadingNode(ast)

        case "paragraph":
            return renderMarkdownParagraphNode(ast)

        case "text":
            return renderMarkdownTextNode(ast)

        case "strong":
            return renderMarkdownStrongNode(ast)

        case "emphasis":
            return renderMarkdownEmphasisNode(ast)

        case "inlineCode":
            return renderMarkdownInlineCodeNode(ast)

        case "link":
            return renderMarkdownLinkNode(ast)

        case "thematicBreak":
            return renderMarkdownThematicBreakNode(ast)

        case "blockquote":
            return renderMarkdownBlockquoteNode(ast)

        case "list":
            return renderMarkdownListNode(ast)

        case "break":
            return renderMarkdownBreakNode(ast)

        default:
            return renderMarkdownDefaultNode(ast)
    }
}

export { MarkdownRendererNode }
