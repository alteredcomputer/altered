/** biome-ignore-all lint/suspicious/noUnnecessaryConditions: False positive. */
import type { Nodes } from "mdast"
import type { ReactNode } from "react"
import type { MarkdownLinePrefix } from "../components/line"
import { renderMarkdownBlockquoteNode } from "./blockquote"
import { renderMarkdownBreakNode } from "./break"
import { renderMarkdownCodeNode } from "./code"
import { renderMarkdownDefaultNode } from "./default"
import { renderMarkdownDefinitionNode } from "./definition"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownDeleteNode } from "./delete"
import { renderMarkdownEmphasisNode } from "./emphasis"
import {
    renderMarkdownFootnoteDefinitionNode,
    renderMarkdownFootnoteReferenceNode
} from "./footnote"
import { renderMarkdownHeadingNode } from "./heading"
import { renderMarkdownHtmlNode } from "./html"
import { renderMarkdownImageNode } from "./image"
import { renderMarkdownInlineCodeNode } from "./inline-code"
import { renderMarkdownLinkNode } from "./link"
import { renderMarkdownListNode } from "./list"
import { renderMarkdownParagraphNode } from "./paragraph"
import { renderMarkdownBlockChildNodes } from "./render-child-node"
import { renderMarkdownStrongNode } from "./strong"
import { renderMarkdownTableNode } from "./table"
import { renderMarkdownTextNode } from "./text"
import { renderMarkdownThematicBreakNode } from "./thematic-break"
import { renderMarkdownYamlNode } from "./yaml"

function MarkdownRendererNode({
    ast,
    linePrefix,
    isBlock = false
}: {
    ast: Nodes
    linePrefix?: MarkdownLinePrefix | undefined

    /** @remarks Whether the node is a block, for node types that can be either, such as HTML. */
    isBlock?: boolean
}): ReactNode {
    const context: MarkdownRendererNodeContext = {
        renderer: MarkdownRendererNode,
        linePrefix
    }

    switch (ast.type) {
        case "root":
            return renderMarkdownBlockChildNodes(ast, context)

        case "yaml":
            return renderMarkdownYamlNode(ast)

        case "heading":
            return renderMarkdownHeadingNode(ast, context)

        case "paragraph":
            return renderMarkdownParagraphNode(ast, context)

        case "text":
            return renderMarkdownTextNode(ast, context)

        case "strong":
            return renderMarkdownStrongNode(ast, context)

        case "emphasis":
            return renderMarkdownEmphasisNode(ast, context)

        case "delete":
            return renderMarkdownDeleteNode(ast, context)

        case "inlineCode":
            return renderMarkdownInlineCodeNode(ast)

        case "link":
        case "linkReference":
            return renderMarkdownLinkNode(ast, context)

        case "image":
        case "imageReference":
            return renderMarkdownImageNode(ast)

        case "definition":
            return renderMarkdownDefinitionNode(ast, context)

        case "footnoteReference":
            return renderMarkdownFootnoteReferenceNode(ast)

        case "footnoteDefinition":
            return renderMarkdownFootnoteDefinitionNode(ast, context)

        case "html":
            return renderMarkdownHtmlNode(ast, context, { isBlock })

        case "thematicBreak":
            return renderMarkdownThematicBreakNode(ast, context)

        case "blockquote":
            return renderMarkdownBlockquoteNode(ast, context)

        case "list":
            return renderMarkdownListNode(ast, context)

        case "table":
            return renderMarkdownTableNode(ast, context)

        case "code":
            return renderMarkdownCodeNode(ast, context)

        case "break":
            return renderMarkdownBreakNode(ast, context)

        default:
            return renderMarkdownDefaultNode(ast, context)
    }
}

export { MarkdownRendererNode }
