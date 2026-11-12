import type { Image, ImageReference } from "mdast"
import { MarkdownLink } from "~/markdown/renderer/components/link"
import { assertValidMarkdownLinkTargetUrl } from "~/markdown/renderer/links/assert-valid-target-url"
import { MarkdownLinkDestination } from "../components/link-destination"

/** @remarks Images aren't shown: each renders as written, as a link that opens the image in a new tab. */
function renderMarkdownImageNode(ast: Image | ImageReference) {
    const url = ast.type === "image" ? ast.url : ast.data?.url
    const alt = ast.data?.raw ?? ast.alt ?? ""

    if (url === undefined) return null

    assertValidMarkdownLinkTargetUrl(url)

    return (
        <MarkdownLink isOpeningInNewTab target={{ text: url }}>
            {ast.data?.marker ?? "!["}
            {alt}
            <MarkdownLinkDestination
                closingMarker={ast.data?.closingMarker ?? `](${url})`}
            />
        </MarkdownLink>
    )
}

export { renderMarkdownImageNode }
