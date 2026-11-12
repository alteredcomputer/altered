import type { MarkdownTransformMatch } from "./definitions"

/** @remarks Each gap between siblings is stored once, on the later sibling as `blankLinesBefore`, so there's nothing to reconcile. "After" and "around" write to the same gaps. A first child has no gap before it and a last child none after it, so those are left alone. */
function ensureBlankLinesBefore(
    { node, previous }: Pick<MarkdownTransformMatch, "node" | "previous">,
    { minimum }: { minimum: number }
) {
    if (!previous) return

    node.data = {
        ...node.data,
        blankLinesBefore: Math.max(node.data?.blankLinesBefore ?? 0, minimum)
    }
}

function ensureBlankLinesAfter(
    { node, next }: Pick<MarkdownTransformMatch, "node" | "next">,
    { minimum }: { minimum: number }
) {
    if (!next) return

    ensureBlankLinesBefore({ node: next, previous: node }, { minimum })
}

function ensureBlankLinesAround(
    match: Pick<MarkdownTransformMatch, "node" | "previous" | "next">,
    { minimum }: { minimum: number }
) {
    ensureBlankLinesBefore(match, { minimum })
    ensureBlankLinesAfter(match, { minimum })
}

function capBlankLinesBefore(
    { node }: Pick<MarkdownTransformMatch, "node">,
    { maximum }: { maximum: number }
) {
    const blankLinesBefore = node.data?.blankLinesBefore
    if (blankLinesBefore === undefined) return

    node.data = {
        ...node.data,
        blankLinesBefore: Math.min(blankLinesBefore, maximum)
    }
}

/** @remarks A string must match the whole marker, and a regular expression is tested against it. */
function replaceMarker(
    { node }: Pick<MarkdownTransformMatch, "node">,
    { from, to }: { from: string | RegExp; to: string }
) {
    const marker = node.data?.marker
    if (marker === undefined) return

    const isMatching =
        typeof from === "string" ? marker === from : from.test(marker)
    if (!isMatching) return

    node.data = { ...node.data, marker: to }
}

/** @remarks Pads each item's marker to the widest in the list, so the items' text lines up, e.g. `9.  ` above `10. `. */
function alignListItemMarkers({ node }: Pick<MarkdownTransformMatch, "node">) {
    if (node.type !== "list") return

    const markers = node.children.map(
        item => item.data?.marker?.trimEnd() ?? ""
    )
    const width = Math.max(...markers.map(marker => marker.length)) + 1

    node.children.forEach((item, index) => {
        item.data = {
            ...item.data,
            marker: (markers[index] ?? "").padEnd(width)
        }
    })
}

export {
    alignListItemMarkers,
    capBlankLinesBefore,
    ensureBlankLinesAfter,
    ensureBlankLinesAround,
    ensureBlankLinesBefore,
    replaceMarker
}
