/** biome-ignore-all lint/suspicious/noUnnecessaryConditions: False positive. */
import type { Nodes } from "mdast"
import type { ReactNode } from "react"
import { renderMarkdownBlockquoteNode } from "./blockquote"
import { renderMarkdownBreakNode } from "./break"
import { renderMarkdownDefaultNode } from "./default"
import type { MarkdownRendererNodeContext } from "./definitions"
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
    const context: MarkdownRendererNodeContext = {
        renderer: MarkdownRendererNode
    }

    switch (ast.type) {
        case "root":
            return renderMarkdownChildNodes(ast, context)

        case "yaml":
            return renderMarkdownYamlNode(ast)

        case "heading":
            return renderMarkdownHeadingNode(ast, context)

        case "paragraph":
            return renderMarkdownParagraphNode(ast, context)

        case "text":
            return renderMarkdownTextNode(ast)

        case "strong":
            return renderMarkdownStrongNode(ast, context)

        case "emphasis":
            return renderMarkdownEmphasisNode(ast, context)

        case "inlineCode":
            return renderMarkdownInlineCodeNode(ast)

        case "link":
            return renderMarkdownLinkNode(ast, context)

        case "thematicBreak":
            return renderMarkdownThematicBreakNode(ast)

        case "blockquote":
            return renderMarkdownBlockquoteNode(ast, context)

        case "list":
            return renderMarkdownListNode(ast, context)

        case "break":
            return renderMarkdownBreakNode(ast)

        default:
            return renderMarkdownDefaultNode(ast, context)
    }
}

export { MarkdownRendererNode }
