import type { Text } from "mdast"
// biome-ignore lint/correctness/noUnresolvedImports: False positive.
import { Fragment } from "react"
import { MarkdownLinePrefixGlyph } from "../components/line"
import type { MarkdownRendererNodeContext } from "./definitions"

/** @remarks Text renders as written, with its escapes and entities. A line break inside a paragraph is kept as a newline, followed by the containers' prefix, so each source line copies as written. */
function renderMarkdownTextNode(
    ast: Text,
    context: MarkdownRendererNodeContext
) {
    const text = ast.data?.raw ?? ast.value
    const continuationPrefix = context.linePrefix?.rest

    if (!continuationPrefix) return text

    return text.split("\n").map((line, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
        <Fragment key={index}>
            {index > 0 ? (
                <>
                    {"\n"}
                    <MarkdownLinePrefixGlyph>
                        {continuationPrefix}
                    </MarkdownLinePrefixGlyph>
                </>
            ) : null}
            {line}
        </Fragment>
    ))
}

export { renderMarkdownTextNode }
