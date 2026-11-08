import type { List } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownListNode(ast: List) {
    const Tag = ast.ordered ? "ol" : "ul"

    const createListItemPrefix = (options: {
        isOrdered?: boolean | null
        startNumber?: number | null

        itemIndex: number
    }) => {
        const { isOrdered, startNumber, itemIndex } = {
            ...options,

            isOrdered: options.isOrdered ?? false,
            startNumber: options.startNumber ?? 1
        }

        if (!isOrdered) return "- "

        return `${startNumber + itemIndex}. `
    }

    return (
        <Tag className="grid">
            {ast.children.map((item, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                <li className="flex" key={`${item.type}-${index}`}>
                    <MarkdownDecorativeGlyph>
                        {createListItemPrefix({
                            isOrdered: ast.ordered,
                            startNumber: ast.start,

                            itemIndex: index
                        })}
                    </MarkdownDecorativeGlyph>

                    <div className="grid gap-line">
                        {renderMarkdownChildNodes(item)}
                    </div>
                </li>
            ))}
        </Tag>
    )
}

export { renderMarkdownListNode }
