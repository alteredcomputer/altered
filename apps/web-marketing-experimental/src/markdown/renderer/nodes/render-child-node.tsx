import type { Nodes } from "mdast"
// biome-ignore lint/correctness/noUnresolvedImports: False positive.
import { Fragment, type ReactNode } from "react"
import { MarkdownBlankLine } from "../components/blank-line"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import {
    emptyMarkdownLinePrefix,
    type MarkdownLinePrefix
} from "../components/line"
import type { MarkdownRendererNodeContext } from "./definitions"

function renderMarkdownChildNodes(
    ast: { children: Nodes[] },
    context: MarkdownRendererNodeContext
) {
    return ast.children.map((child, index) => (
        <context.renderer
            ast={child}
            // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
            key={`${child.type}-${index}`}
            linePrefix={context.linePrefix}
        />
    ))
}

type MarkdownBlockParentNode<ChildNode extends Nodes> = {
    children: ChildNode[]
}

/** @remarks Renders block-level children with real blank lines between them, so the spacing is visible and copies as text. The counts come from the transform step, and a blank line keeps its containers' prefix, trimmed, e.g. `>`. Only the first child continues the line its parent started, so the others start with the continuation prefix. */
function renderMarkdownBlockChildNodes<ChildNode extends Nodes>(
    ast: MarkdownBlockParentNode<ChildNode>,
    context: MarkdownRendererNodeContext,
    options?: {
        getChildLinePrefix?: (index: number) => MarkdownLinePrefix
        renderChild?: (
            child: ChildNode,
            linePrefix: MarkdownLinePrefix,
            index: number
        ) => ReactNode
    }
) {
    return ast.children.map((child, index) => {
        const blankLineCount = child.data?.blankLinesBefore ?? 0

        const parentLinePrefix = context.linePrefix ?? emptyMarkdownLinePrefix

        const linePrefix =
            options?.getChildLinePrefix?.(index) ??
            (index === 0
                ? parentLinePrefix
                : { first: parentLinePrefix.rest, rest: parentLinePrefix.rest })

        const blankLinePrefix = linePrefix.rest.trimEnd()

        return (
            // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
            <Fragment key={`${child.type}-${index}`}>
                {Array.from({ length: blankLineCount }, (_, blankLineIndex) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                    <MarkdownBlankLine key={blankLineIndex}>
                        {blankLinePrefix ? (
                            <MarkdownDecorativeGlyph>
                                {blankLinePrefix}
                            </MarkdownDecorativeGlyph>
                        ) : null}
                    </MarkdownBlankLine>
                ))}

                {options?.renderChild ? (
                    options.renderChild(child, linePrefix, index)
                ) : (
                    <context.renderer
                        ast={child}
                        isBlock
                        linePrefix={linePrefix}
                    />
                )}
            </Fragment>
        )
    })
}

/** @remarks A container (blockquote, list item, footnote definition) draws nothing of its own but its marker: the first line of its first child starts with the marker, and every other line with the continuation. A marker alone on its line, or with no content, gets a line of its own. */
function renderMarkdownContainerChildNodes(
    ast: MarkdownBlockParentNode<Nodes> & {
        data?: { isMarkerOnOwnLine?: boolean } | undefined
    },
    context: MarkdownRendererNodeContext,
    { marker, continuation }: { marker: string; continuation: string }
) {
    const parentLinePrefix = context.linePrefix ?? emptyMarkdownLinePrefix

    const first = parentLinePrefix.first + marker
    const rest = parentLinePrefix.rest + continuation

    const isMarkerOnOwnLine =
        ast.data?.isMarkerOnOwnLine === true || ast.children.length === 0

    return (
        <>
            {isMarkerOnOwnLine ? (
                <MarkdownBlankLine>
                    <MarkdownDecorativeGlyph>
                        {first.trimEnd()}
                    </MarkdownDecorativeGlyph>
                </MarkdownBlankLine>
            ) : null}

            {renderMarkdownBlockChildNodes(ast, context, {
                getChildLinePrefix: index =>
                    index === 0 && !isMarkerOnOwnLine
                        ? { first, rest }
                        : { first: rest, rest }
            })}
        </>
    )
}

export {
    renderMarkdownBlockChildNodes,
    renderMarkdownChildNodes,
    renderMarkdownContainerChildNodes
}
