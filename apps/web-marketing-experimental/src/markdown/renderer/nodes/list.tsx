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

        if (!isOrdered) return "-  "

        return `${startNumber + itemIndex}. `
    }

    const hasBlankLineBeforeListItem = ({
        listItemIndex
    }: {
        listItemIndex: number
    }): boolean => {
        const previousItemEndLineNumber =
            ast.children[listItemIndex - 1]?.position?.end.line

        const currentItemStartLineNumber =
            ast.children[listItemIndex]?.position?.start.line

        const isMissingItemPosition = !(
            previousItemEndLineNumber && currentItemStartLineNumber
        )
        if (isMissingItemPosition) return false

        const lineNumberDeltaBetweenItems =
            currentItemStartLineNumber - previousItemEndLineNumber

        return lineNumberDeltaBetweenItems >= 2
    }

    return (
        <Tag className="grid pb-line">
            {ast.children.map((item, index) => (
                <li
                    className={
                        hasBlankLineBeforeListItem({ listItemIndex: index })
                            ? "flex pt-line"
                            : "flex"
                    }
                    // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                    key={`${item.type}-${index}`}
                >
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
