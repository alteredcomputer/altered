import type { Root } from "mdast"
import { visitMarkdownNodes } from "./visit"

/** @remarks A reference (`[label][ref]`, `[ref]`) points at a definition (`[ref]: /koa`) that may come anywhere in the file, so every definition is collected first, then each reference gets its URL. */
function resolveMarkdownReferences({
    mdast,
    source
}: {
    mdast: Root
    source: string
}) {
    const urlByIdentifier = new Map<string, string>()

    visitMarkdownNodes({
        node: mdast,
        source,
        visitor: ({ node }) => {
            if (node.type !== "definition") return
            if (!urlByIdentifier.has(node.identifier))
                urlByIdentifier.set(node.identifier, node.url)
        }
    })

    visitMarkdownNodes({
        node: mdast,
        source,
        visitor: ({ node }) => {
            if (node.type !== "linkReference" && node.type !== "imageReference")
                return

            const url = urlByIdentifier.get(node.identifier)
            if (url !== undefined) node.data = { ...node.data, url }
        }
    })
}

export { resolveMarkdownReferences }
