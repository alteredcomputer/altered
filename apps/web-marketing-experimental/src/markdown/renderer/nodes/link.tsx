import type { Link, LinkReference } from "mdast"
import { MarkdownLink } from "~/markdown/renderer/components/link"
import { assertValidMarkdownLinkTargetUrl } from "~/markdown/renderer/links/assert-valid-target-url"
import type { MarkdownLinkOverrideLabelVariant } from "~/markdown/renderer/links/definitions"
import { getMarkdownLinkOverrideConfig } from "~/markdown/renderer/links/overrides/get"
import { MarkdownLinkDestination } from "../components/link-destination"
import type { MarkdownRendererNodeContext } from "./definitions"
import { renderMarkdownChildNodes } from "./render-child-node"

const renderMarkdownLinkNodeLabel = (
    ast: Link | LinkReference,
    context: MarkdownRendererNodeContext,

    {
        labelOverride
    }: {
        labelOverride?: MarkdownLinkOverrideLabelVariant[]
    }
) => {
    if (!labelOverride) return renderMarkdownChildNodes(ast, context)

    return labelOverride.map(labelVariant => (
        <span key={labelVariant.text} {...labelVariant.attributes}>
            {labelVariant.text}
        </span>
    ))
}

/** @remarks Renders inline links (`[label](/koa "Title")`), references (`[label][ref]`, `[label][]`, `[ref]`), autolinks (`<https://…>`) and bare URLs as written, around the label. A reference's URL comes from its definition. */
function renderMarkdownLinkNode(
    ast: Link | LinkReference,
    context: MarkdownRendererNodeContext
) {
    const linkTargetText = ast.type === "link" ? ast.url : ast.data?.url

    /* Unreachable: the parser only makes a reference when its definition exists. */
    if (linkTargetText === undefined)
        return renderMarkdownChildNodes(ast, context)

    const overrideConfig = getMarkdownLinkOverrideConfig({
        query: {
            target: { text: linkTargetText }
        }
    })

    const overrideAction = overrideConfig?.target?.action
    if (!overrideAction) assertValidMarkdownLinkTargetUrl(linkTargetText)

    const resolvedLabel = renderMarkdownLinkNodeLabel(ast, context, {
        labelOverride: overrideConfig?.label
    })

    return (
        <MarkdownLink target={{ text: linkTargetText }}>
            {ast.data?.marker ?? "["}
            {resolvedLabel}
            <MarkdownLinkDestination
                closingMarker={
                    ast.data?.closingMarker ?? `](${linkTargetText})`
                }
            />
        </MarkdownLink>
    )
}

export { renderMarkdownLinkNode }
