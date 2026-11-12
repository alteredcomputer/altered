import type { Nodes } from "mdast"
import type { MarkdownTransformMatch } from "./definitions"

/** @remarks Calls the visitor for every node, depth first, with its parent and siblings. */
function visitMarkdownNodes({
    node,
    source,
    visitor
}: {
    node: Nodes
    source: string
    visitor: (match: MarkdownTransformMatch) => void
}) {
    const visit = (match: MarkdownTransformMatch) => {
        visitor(match)

        if (!("children" in match.node)) return

        const parent = match.node
        const children: Nodes[] = parent.children

        children.forEach((child, index) => {
            visit({
                node: child,
                parent,
                previous: children[index - 1],
                next: children[index + 1],
                source
            })
        })
    }

    visit({
        node,
        parent: undefined,
        previous: undefined,
        next: undefined,
        source
    })
}

export { visitMarkdownNodes }
