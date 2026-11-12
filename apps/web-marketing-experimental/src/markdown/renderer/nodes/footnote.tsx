import type { FootnoteDefinition, FootnoteReference } from "mdast"
import { MarkdownLink } from "~/markdown/renderer/components/link"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownContainerChildNodes } from "./render-child-node"

const nonAlphanumericPattern = /[^a-z0-9]+/g

const createMarkdownFootnoteId = (identifier: string) =>
    `footnote-${identifier.toLowerCase().replace(nonAlphanumericPattern, "-")}`

/** @remarks A reference, e.g. `[^note]`, links to its definition. */
function renderMarkdownFootnoteReferenceNode(ast: FootnoteReference) {
    return (
        <MarkdownLink
            target={{ text: `#${createMarkdownFootnoteId(ast.identifier)}` }}
        >
            {`[^${ast.label ?? ast.identifier}]`}
        </MarkdownLink>
    )
}

/** @remarks A definition is a container like a list item: `[^note]: ` starts its first line, and its other lines are indented by four spaces. */
function renderMarkdownFootnoteDefinitionNode(
    ast: FootnoteDefinition,
    context: MarkdownRendererNodeContext
) {
    return (
        <div id={createMarkdownFootnoteId(ast.identifier)}>
            {renderMarkdownContainerChildNodes(ast, context, {
                marker:
                    ast.data?.marker ?? `[^${ast.label ?? ast.identifier}]: `,
                continuation: "    "
            })}
        </div>
    )
}

export {
    renderMarkdownFootnoteDefinitionNode,
    renderMarkdownFootnoteReferenceNode
}
