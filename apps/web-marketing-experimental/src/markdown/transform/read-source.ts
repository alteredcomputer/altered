/** biome-ignore-all lint/suspicious/noUnnecessaryConditions: False positive. */
import type { Nodes } from "mdast"
import type { MarkdownTransformMatch } from "./definitions"

const trailingWhitespacePattern = /\s$/
const codeFencePattern = /^(?:`{3,}|~{3,})\s*/
const leadingWhitespacePattern = /^\s*/
const leadingBackticksPattern = /^`+/
const leadingTildesPattern = /^~+/
const containerLinePrefixPattern = /^[ \t>]*/
const lineEndingPattern = /\r?\n[\s\S]*$/

const markerLengthByNodeType = {
    emphasis: 1,
    strong: 2
} as const

/** @remarks The source from a container's start up to its first child, on the first line only, e.g. `-   ` for a list item or `>   ` for a blockquote. */
function readMarkdownPrefix({
    node,
    source
}: Pick<MarkdownTransformMatch, "node" | "source">) {
    const start = node.position?.start.offset
    const firstChild = "children" in node ? node.children[0] : undefined
    const end = firstChild?.position?.start.offset ?? node.position?.end.offset

    const [firstLine = ""] = source.slice(start, end).split("\n")

    return firstLine
}

/** @remarks The index of the `]` closing the `[` at `openIndex`, skipping escaped and nested brackets. */
function findClosingBracketIndex(text: string, openIndex: number) {
    let depth = 0

    for (let index = openIndex; index < text.length; index += 1) {
        const character = text[index]

        if (character === "\\") index += 1
        else if (character === "[") depth += 1
        else if (character === "]") {
            depth -= 1
            if (depth === 0) return index
        }
    }

    return -1
}

/** @remarks A text node's source as written. Lines after the first also hold their containers' prefixes (`> `, a list item's indent), which the renderer draws itself, so they're stripped, as the parser does. */
function readMarkdownText({
    node,
    source
}: Pick<MarkdownTransformMatch, "node" | "source">) {
    const raw = source.slice(
        node.position?.start.offset,
        node.position?.end.offset
    )

    return raw
        .split("\n")
        .map((line, index) =>
            index === 0 ? line : line.replace(containerLinePrefixPattern, "")
        )
        .join("\n")
}

/** @remarks The source between a parent's start and its first child, and between its last child and its end, e.g. `[` and `](/koa)` around a link's label, or `<` and `>` around an autolink. */
function readMarkdownEnclosingMarkers({
    node,
    source
}: Pick<MarkdownTransformMatch, "node" | "source">) {
    const children: Nodes[] = "children" in node ? node.children : []

    const firstChildStart = children[0]?.position?.start.offset
    const lastChildEnd = children.at(-1)?.position?.end.offset

    if (firstChildStart === undefined || lastChildEnd === undefined) return

    return {
        marker: source.slice(node.position?.start.offset, firstChildStart),
        closingMarker: source.slice(lastChildEnd, node.position?.end.offset)
    }
}

/** @remarks Where a node's content ends. Inside a blockquote, a list's position also takes in the blank `>` line after it, so a list ends where its last item does. */
function readMarkdownContentEndLine(node: Nodes): number | undefined {
    const lastChild =
        node.type === "list" || node.type === "listItem"
            ? node.children.at(-1)
            : undefined

    return lastChild
        ? readMarkdownContentEndLine(lastChild)
        : node.position?.end.line
}

/** @remarks The source of a parent's children, without what wraps them, e.g. a table cell's content without its pipes or padding, so its width can be measured. */
function readMarkdownChildrenSource({
    node,
    source
}: Pick<MarkdownTransformMatch, "node" | "source">) {
    const children: Nodes[] = "children" in node ? node.children : []

    const firstChildStart = children[0]?.position?.start.offset
    const lastChildEnd = children.at(-1)?.position?.end.offset

    return firstChildStart === undefined
        ? ""
        : source.slice(firstChildStart, lastChildEnd)
}

/** @remarks A container whose content starts below its marker, as in `-` then an indented paragraph, or `>` then `> text`. Any lines between them are blank lines before its first child. */
function readMarkdownContainerContentStart({
    node
}: Pick<MarkdownTransformMatch, "node">) {
    if (
        node.type !== "listItem" &&
        node.type !== "blockquote" &&
        node.type !== "footnoteDefinition"
    )
        return

    const [firstChild] = node.children
    const startLine = node.position?.start.line
    const firstChildStartLine = firstChild?.position?.start.line

    if (!(firstChild && startLine && firstChildStartLine)) return
    if (firstChildStartLine <= startLine) return

    node.data = { ...node.data, isMarkerOnOwnLine: true }

    firstChild.data = {
        ...firstChild.data,
        blankLinesBefore: firstChildStartLine - startLine - 1
    }
}

/** @remarks Links, images and definitions, whose syntax wraps a label and ends with a destination or reference. */
function readMarkdownLinkLikeData({
    node,
    source
}: Pick<MarkdownTransformMatch, "node" | "source">): NonNullable<
    Nodes["data"]
> {
    const raw = source.slice(
        node.position?.start.offset,
        node.position?.end.offset
    )

    switch (node.type) {
        case "link":
        case "linkReference": {
            const enclosingMarkers = readMarkdownEnclosingMarkers({
                node,
                source
            })

            if (enclosingMarkers) return enclosingMarkers

            /* An empty label, as in `[](/koa)`. */
            const labelEnd = findClosingBracketIndex(raw, 0)

            return {
                marker: raw.slice(0, labelEnd),
                closingMarker: raw.slice(labelEnd)
            }
        }

        /* An image's alt text isn't a child node, so it's kept as written between the markers, as in `![` `alt` `](/image.png)`. */
        case "image":
        case "imageReference": {
            const labelEnd = findClosingBracketIndex(raw, 1)

            return {
                marker: "![",
                raw: raw.slice(2, labelEnd),
                closingMarker: raw.slice(labelEnd)
            }
        }

        /* `[label]: ` is the marker, and the destination and title are kept as written. */
        case "definition": {
            const labelEnd = findClosingBracketIndex(raw, 0) + 2
            const afterLabel = raw.slice(labelEnd)
            const spacing = leadingWhitespacePattern.exec(afterLabel)?.[0] ?? ""

            return {
                marker: raw.slice(0, labelEnd) + spacing,
                raw: afterLabel.slice(spacing.length)
            }
        }

        default:
            return {}
    }
}

/** @remarks mdast drops what the parser doesn't need, such as blank lines and which syntax characters were used, and decodes escapes and entities, so they're read back from the source by position. */
function readMarkdownSourceIntoNode({
    node,
    previous,
    source
}: MarkdownTransformMatch) {
    const start = node.position?.start
    const end = node.position?.end

    if (!(start && end)) return

    const setData = (data: NonNullable<typeof node.data>) => {
        node.data = { ...node.data, ...data }
    }

    const raw = source.slice(start.offset, end.offset)

    const previousEndLine = previous && readMarkdownContentEndLine(previous)

    if (previousEndLine)
        setData({
            blankLinesBefore: Math.max(0, start.line - previousEndLine - 1)
        })

    readMarkdownContainerContentStart({ node })

    switch (node.type) {
        case "text":
            return setData({ raw: readMarkdownText({ node, source }) })

        case "emphasis":
        case "strong":
            return setData({
                marker: source.slice(
                    start.offset,
                    (start.offset ?? 0) + markerLengthByNodeType[node.type]
                )
            })

        case "delete":
            return setData({ marker: leadingTildesPattern.exec(raw)?.[0] })

        /* A hard break runs to the end of its line: `\` or the trailing spaces. */
        case "break":
            return setData({ marker: raw.replace(lineEndingPattern, "") })

        case "thematicBreak":
            return setData({ marker: raw.trim() })

        case "listItem": {
            const prefix = readMarkdownPrefix({ node, source })

            return setData({
                marker: trailingWhitespacePattern.test(prefix)
                    ? prefix
                    : `${prefix} `
            })
        }

        case "blockquote":
        case "footnoteDefinition":
            return setData({ marker: readMarkdownPrefix({ node, source }) })

        case "heading": {
            const prefix = readMarkdownPrefix({ node, source }).trimStart()
            const isAtxHeading = prefix.startsWith("#")

            /* A setext heading is underlined instead, so its marker is the underline. */
            const underline = raw.split("\n").at(-1)?.trim()

            /* An ATX heading can close with hashes, as in `## Title ##`. */
            const closingMarker = isAtxHeading
                ? readMarkdownEnclosingMarkers({
                      node,
                      source
                  })?.closingMarker.trimEnd()
                : undefined

            return setData({
                marker: isAtxHeading ? prefix : underline,
                ...(closingMarker ? { closingMarker } : {})
            })
        }

        case "code": {
            const firstLine = source.slice(start.offset).split("\n")[0] ?? ""

            /* A fenced block's marker is its fence plus any space before the info string, e.g. `~~~~ `. An indented block has no fence, so its marker is the indent. */
            const fence = codeFencePattern.exec(firstLine)?.[0]
            const indent = leadingWhitespacePattern.exec(firstLine)?.[0]

            return setData({ marker: fence ?? indent })
        }

        case "inlineCode": {
            const backticks = leadingBackticksPattern.exec(raw)?.[0] ?? "`"
            const content = raw.slice(backticks.length, -backticks.length)

            /* The parser strips one padding space from each side, as in ``` `` `a` `` ```, so the marker keeps it. */
            const isPadded =
                content !== node.value &&
                content.startsWith(" ") &&
                content.endsWith(" ")

            return setData({ marker: isPadded ? `${backticks} ` : backticks })
        }

        case "link":
        case "linkReference":
        case "image":
        case "imageReference":
        case "definition":
            return setData(readMarkdownLinkLikeData({ node, source }))

        case "tableCell":
            return setData({
                raw: readMarkdownChildrenSource({ node, source })
            })

        default:
            return
    }
}

export { readMarkdownSourceIntoNode }
