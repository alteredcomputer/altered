import type { Table } from "mdast"
import { emptyMarkdownLinePrefix } from "../components/line"
import { MarkdownTable } from "../components/table"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

/** @remarks Cells are rendered here and measured by their source, since each renders as written. The table itself is laid out on the client, which can show a window of its columns. */
function renderMarkdownTableNode(
    ast: Table,
    context: MarkdownRendererNodeContext
) {
    const rows = ast.children.map(row =>
        row.children.map(cell => ({
            width: [...(cell.data?.raw ?? "")].length,
            content: renderMarkdownChildNodes(cell, context)
        }))
    )

    return (
        <MarkdownTable
            align={ast.align ?? []}
            linePrefix={context.linePrefix ?? emptyMarkdownLinePrefix}
            rows={rows}
        />
    )
}

export { renderMarkdownTableNode }
