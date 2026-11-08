import { markdownLinkOverrideConfig } from "~/config/markdown/links/overrides"
import type { MarkdownLinkOverrideConfig } from "../definitions"

function getMarkdownLinkOverrideConfig({
    query
}: {
    query: { target: { text: string } }
}): MarkdownLinkOverrideConfig | null {
    return (
        markdownLinkOverrideConfig.find(override =>
            override.find({
                target: { text: query.target.text }
            })
        ) ?? null
    )
}

export { getMarkdownLinkOverrideConfig }
