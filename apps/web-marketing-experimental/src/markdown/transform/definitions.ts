import type { Nodes, Parent, Root } from "mdast"

declare module "mdast" {
    // biome-ignore lint/style/useConsistentTypeDefinitions: Module augmentation needs an interface to merge into.
    interface Data {
        /** @remarks Blank lines between this node and its previous sibling. Read from the source, then adjusted by the transform rules. */
        blankLinesBefore?: number

        /** @remarks Closing syntax that doesn't mirror the opening marker, e.g. ` ##` closing a heading, or `](/koa "Title")` and `][ref]` closing a link's label. */
        closingMarker?: string

        /** @remarks The container's marker is alone on its line and its content starts below, e.g. `-` followed by an indented paragraph. */
        isMarkerOnOwnLine?: boolean

        /** @remarks The node's syntax characters as written, e.g. `_` for emphasis, `\` for a hard break, `-   ` for a list item, `##  ` for a heading (or its underline, if it's a setext heading) `>   ` for a blockquote's first line and `~~~ ` for a code fence. Opening and closing markers mirror each other, so one is stored, unless there's a `closingMarker`. */
        marker?: string

        /** @remarks Content as written, where the parser decodes it, e.g. a text node's escapes and entities (`\*`, `&copy;`), an image's alt text, or a definition's destination and title. */
        raw?: string

        /** @remarks A reference's URL, resolved from its definition. */
        url?: string
    }
}

type MarkdownTransformMatch = {
    node: Nodes
    parent: Parent | undefined
    previous: Nodes | undefined
    next: Nodes | undefined
    source: string
}

type MarkdownTransformRule = {
    name: string
    description: string

    find: (match: MarkdownTransformMatch) => boolean
    transform: (match: MarkdownTransformMatch) => void
}

type MarkdownTransformOptions = {
    mdast: Root
    source: string
    rules: MarkdownTransformRule[]
}

export type {
    MarkdownTransformMatch,
    MarkdownTransformOptions,
    MarkdownTransformRule
}
