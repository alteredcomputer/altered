"use client"

import type { AlignType } from "mdast"
// biome-ignore lint/correctness/noUnresolvedImports: False positive.
import { Fragment, type ReactNode, useCallback, useState } from "react"
import { MarkdownBlankLine } from "./blank-line"
import { MarkdownDecorativeGlyph } from "./decorative-glyph"
import { MarkdownLine, type MarkdownLinePrefix } from "./line"
import { MarkdownActionOverrideLink } from "./link"

/** @remarks The measure (64ch) less the 1ch every line wraps early by. */
const markdownTableMaxLineLength = 63

/** @remarks How many columns a table too wide for the measure shows at once. */
const markdownTableVisibleColumnCount = 3

/** @remarks The narrowest a column can be, since its delimiter needs three characters, e.g. `:-:`. */
const markdownTableMinimumColumnWidth = 3

type MarkdownTableCell = { width: number; content: ReactNode }

const range = (length: number) => Array.from({ length }, (_, index) => index)

const createDelimiter = (align: AlignType | undefined, width: number) => {
    if (align === "left") return `:${"-".repeat(width - 1)}`
    if (align === "right") return `${"-".repeat(width - 1)}:`
    if (align === "center") return `:${"-".repeat(width - 2)}:`

    return "-".repeat(width)
}

const createPadding = (align: AlignType | undefined, space: number) => {
    if (align === "right") return { before: space, after: 0 }
    if (align === "center") {
        const before = Math.floor(space / 2)
        return { before, after: space - before }
    }

    return { before: 0, after: space }
}

/** @remarks Balanced like a formatter would (every column padded to its widest cell, aligned per its delimiter), so it copies as tidy markdown. A table wider than the measure shows a window of its columns, with buttons below that cycle through them. */
function MarkdownTable({
    align,
    rows,
    linePrefix
}: {
    align: (AlignType | undefined)[]
    rows: MarkdownTableCell[][]
    linePrefix: MarkdownLinePrefix
}) {
    const columnCount = Math.max(align.length, ...rows.map(row => row.length))

    const columnWidths = range(columnCount).map(column =>
        Math.max(
            markdownTableMinimumColumnWidth,
            ...rows.map(row => row[column]?.width ?? 0)
        )
    )

    const getLineLength = (columns: number[]) =>
        columns.reduce(
            (length, column) => length + (columnWidths[column] ?? 0) + 3,
            1
        )

    const availableLineLength =
        markdownTableMaxLineLength - linePrefix.rest.length

    const isWindowed =
        columnCount > markdownTableVisibleColumnCount &&
        getLineLength(range(columnCount)) > availableLineLength

    const lastFirstVisibleColumn = columnCount - markdownTableVisibleColumnCount

    const [firstVisibleColumn, setFirstVisibleColumn] = useState(0)

    const showPreviousColumn = useCallback(
        () =>
            setFirstVisibleColumn(column =>
                column === 0 ? lastFirstVisibleColumn : column - 1
            ),
        [lastFirstVisibleColumn]
    )

    const showNextColumn = useCallback(
        () =>
            setFirstVisibleColumn(column =>
                column >= lastFirstVisibleColumn ? 0 : column + 1
            ),
        [lastFirstVisibleColumn]
    )

    const visibleColumns = isWindowed
        ? range(markdownTableVisibleColumnCount).map(
              index => firstVisibleColumn + index
          )
        : range(columnCount)

    const [headerRow = [], ...bodyRows] = rows

    const renderRow = (row: MarkdownTableCell[]) => (
        <>
            <MarkdownDecorativeGlyph>{"|"}</MarkdownDecorativeGlyph>

            {visibleColumns.map(column => {
                const cell = row[column]
                const padding = createPadding(
                    align[column],
                    (columnWidths[column] ?? 0) - (cell?.width ?? 0)
                )

                return (
                    <Fragment key={column}>
                        {" ".repeat(padding.before + 1)}
                        {cell?.content}
                        {" ".repeat(padding.after + 1)}
                        <MarkdownDecorativeGlyph>{"|"}</MarkdownDecorativeGlyph>
                    </Fragment>
                )
            })}
        </>
    )

    const delimiterRow = (
        <MarkdownDecorativeGlyph>
            {`|${visibleColumns
                .map(
                    column =>
                        ` ${createDelimiter(align[column], columnWidths[column] ?? 0)} |`
                )
                .join("")}`}
        </MarkdownDecorativeGlyph>
    )

    const lines = [
        renderRow(headerRow),
        delimiterRow,
        ...bodyRows.map(renderRow)
    ]

    const continuationLinePrefix = {
        first: linePrefix.rest,
        rest: linePrefix.rest
    }

    const previousButtonLabel = "[<--](action:table-prev)"
    const nextButtonLabel = "[-->](action:table-next)"

    const buttonSpacing = Math.max(
        1,
        getLineLength(visibleColumns) -
            previousButtonLabel.length -
            nextButtonLabel.length
    )

    return (
        <>
            {/* Scrolls only if even the window is wider than the measure. */}
            <div className="grid overflow-x-auto">
                {lines.map((line, index) => (
                    <MarkdownLine
                        className="whitespace-pre"
                        // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                        key={index}
                        linePrefix={
                            index === 0 ? linePrefix : continuationLinePrefix
                        }
                    >
                        {line}
                    </MarkdownLine>
                ))}
            </div>

            {isWindowed ? (
                <>
                    <MarkdownBlankLine>
                        {linePrefix.rest.trimEnd() ? (
                            <MarkdownDecorativeGlyph>
                                {linePrefix.rest.trimEnd()}
                            </MarkdownDecorativeGlyph>
                        ) : null}
                    </MarkdownBlankLine>

                    <MarkdownLine
                        className="whitespace-pre"
                        linePrefix={continuationLinePrefix}
                    >
                        <MarkdownActionOverrideLink
                            actionOverride={showPreviousColumn}
                            target={{ text: "action:table-prev" }}
                        >
                            {previousButtonLabel}
                        </MarkdownActionOverrideLink>

                        {" ".repeat(buttonSpacing)}

                        <MarkdownActionOverrideLink
                            actionOverride={showNextColumn}
                            target={{ text: "action:table-next" }}
                        >
                            {nextButtonLabel}
                        </MarkdownActionOverrideLink>
                    </MarkdownLine>
                </>
            ) : null}
        </>
    )
}

export { MarkdownTable }
