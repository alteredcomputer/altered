import type { List } from "mdast"
import type { MarkdownRendererNodeContext } from "./definitions"
import {
    renderMarkdownBlockChildNodes,
    renderMarkdownContainerChildNodes
} from "./render-child-node"

function renderMarkdownListNode(
    ast: List,
    context: MarkdownRendererNodeContext
) {
    const Tag = ast.ordered ? "ol" : "ul"

    return (
        <Tag>
            {renderMarkdownBlockChildNodes(ast, context, {
                renderChild: (item, linePrefix, itemIndex) => {
                    /** @remarks The marker is read from the source, e.g. `-   `, so it keeps its spacing. Without one, it's derived from the list. Continuation lines are indented to the marker's width. */
                    const marker =
                        item.data?.marker ??
                        `${ast.ordered ? `${(ast.start ?? 1) + itemIndex}.` : "-"} `

                    return (
                        <li>
                            {renderMarkdownContainerChildNodes(
                                item,
                                { ...context, linePrefix },
                                {
                                    marker,
                                    continuation: " ".repeat(marker.length)
                                }
                            )}
                        </li>
                    )
                }
            })}
        </Tag>
    )
}

export { renderMarkdownListNode }
