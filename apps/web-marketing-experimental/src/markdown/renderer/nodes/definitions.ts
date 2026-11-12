import type { Nodes } from "mdast"
import type { ReactNode } from "react"
import type { MarkdownLinePrefix } from "../components/line"

type MarkdownRendererNodeContext = {
    renderer: (props: {
        ast: Nodes
        linePrefix?: MarkdownLinePrefix | undefined
        isBlock?: boolean
    }) => ReactNode

    /** @remarks The containers' syntax at the start of each line, e.g. `> ` in a blockquote. */
    linePrefix?: MarkdownLinePrefix | undefined
}

export type { MarkdownRendererNodeContext }
