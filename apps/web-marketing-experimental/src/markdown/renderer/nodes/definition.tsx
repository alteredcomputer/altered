import type { Definition } from "mdast"
import { MarkdownLink } from "~/markdown/renderer/components/link"
import { assertValidMarkdownLinkTargetUrl } from "~/markdown/renderer/links/assert-valid-target-url"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import { MarkdownLine } from "../components/line"
import type { MarkdownRendererNodeContext } from "./definitions"

/** @remarks A reference's definition, e.g. `[ref]: /koa "Title"`: the label is syntax, and the destination links to the URL. */
function renderMarkdownDefinitionNode(
    ast: Definition,
    context: MarkdownRendererNodeContext
) {
    assertValidMarkdownLinkTargetUrl(ast.url)

    return (
        <MarkdownLine
            className="whitespace-pre-line"
            linePrefix={context.linePrefix}
        >
            <span className="whitespace-pre">
                <MarkdownDecorativeGlyph>
                    {ast.data?.marker ?? `[${ast.label ?? ast.identifier}]: `}
                </MarkdownDecorativeGlyph>
            </span>

            <MarkdownLink target={{ text: ast.url }}>
                <span className="break-all">{ast.data?.raw ?? ast.url}</span>
            </MarkdownLink>
        </MarkdownLine>
    )
}

export { renderMarkdownDefinitionNode }
