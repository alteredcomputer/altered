import type { List } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

function renderMarkdownListNode(
    ast: List,
    context: MarkdownRendererNodeContext
) {
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
                    {/* Since we're using `flex`, the 'list item prefix' would shrink + wrap for long list items and the trailing space would collapse. The span wrapper fixes that. */}

                    <span className="shrink-0 whitespace-pre">
                        <MarkdownDecorativeGlyph>
                            {createListItemPrefix({
                                isOrdered: ast.ordered,
                                startNumber: ast.start,

                                itemIndex: index
                            })}
                        </MarkdownDecorativeGlyph>
                    </span>

                    <div className="grid gap-line">
                        {renderMarkdownChildNodes(item, context)}
                    </div>
                </li>
            ))}
        </Tag>
    )
}

export { renderMarkdownListNode }
