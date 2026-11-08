import type { Link } from "mdast"
import { MarkdownLink } from "~/markdown/renderer/components/link"
import { assertValidMarkdownLinkTargetUrl } from "~/markdown/renderer/links/assert-valid-target-url"
import type { MarkdownLinkOverrideLabelVariant } from "~/markdown/renderer/links/definitions"
import { getMarkdownLinkOverrideConfig } from "~/markdown/renderer/links/overrides/get"
import { renderMarkdownChildNodes } from "./render-child-node"

const renderMarkdownLinkNodeLabel = (
    ast: Link,

    {
        labelOverride
    }: {
        labelOverride?: MarkdownLinkOverrideLabelVariant[]
    }
) => {
    if (!labelOverride) return renderMarkdownChildNodes(ast)

    return labelOverride.map(labelVariant => (
        <span key={labelVariant.text} {...labelVariant.attributes}>
            {labelVariant.text}
        </span>
    ))
}

function renderMarkdownLinkNode(ast: Link) {
    const linkTargetText = ast.url

    const overrideConfig = getMarkdownLinkOverrideConfig({
        query: {
            target: { text: linkTargetText }
        }
    })

    const overrideAction = overrideConfig?.target?.action
    if (!overrideAction) assertValidMarkdownLinkTargetUrl(linkTargetText)

    const resolvedLabel = renderMarkdownLinkNodeLabel(ast, {
        labelOverride: overrideConfig?.label
    })

    return (
        <MarkdownLink target={{ text: linkTargetText }}>
            {"["}
            {resolvedLabel}
            {"]"}

            {/* Remove `break-all` if per-character target text wrapping becomes a problem. */}
            <span className="break-all">
                {"("}
                {linkTargetText}
                {")"}
            </span>
        </MarkdownLink>
    )
}

export { renderMarkdownLinkNode }
