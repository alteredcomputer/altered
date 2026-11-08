import type { Nodes } from "mdast"
import type { ReactNode } from "react"

type MarkdownRendererNodeContext = {
    renderer: (props: { ast: Nodes }) => ReactNode
}

export type { MarkdownRendererNodeContext }
