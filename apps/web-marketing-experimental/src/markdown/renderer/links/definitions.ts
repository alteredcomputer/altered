type MarkdownLinkOverrideLabelVariant = {
    text: string
    attributes?: Record<`data-${string}`, string>
}

type MarkdownLinkOverrideConfig = {
    find: (options: { target: { text: string } }) => boolean

    label?: MarkdownLinkOverrideLabelVariant[]

    target?: {
        action?: (text: string) => void
    }
}

export type { MarkdownLinkOverrideConfig, MarkdownLinkOverrideLabelVariant }
