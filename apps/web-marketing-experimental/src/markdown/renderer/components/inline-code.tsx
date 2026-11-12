const leadingWordPattern = /^\S*/
const trailingWordPattern = /\S*$/

/** @remarks The closing marker mirrors the opening one, so an opening of two backticks and a padding space closes with the space, then the backticks. A padding space is a place to wrap, so the markers are kept on the line of the word beside them. */
function MarkdownInlineCode({
    value,
    marker = "`"
}: {
    value: string
    marker?: string
}) {
    const closingMarker = [...marker].reverse().join("")

    if (!marker.endsWith(" "))
        return (
            <code className="bg-foreground/4-64 text-foreground/32-64 whitespace-pre-wrap">
                {marker}
                {value}
                {closingMarker}
            </code>
        )

    const leadingWord = leadingWordPattern.exec(value)?.[0] ?? ""
    const trailingWord =
        value.length > leadingWord.length
            ? (trailingWordPattern.exec(value)?.[0] ?? "")
            : ""
    const middle = value.slice(
        leadingWord.length,
        value.length - trailingWord.length
    )

    return (
        <code className="bg-foreground/4-64 text-foreground/32-64 whitespace-pre-wrap">
            <span className="whitespace-pre">
                {marker}
                {leadingWord}
            </span>
            {middle}
            <span className="whitespace-pre">
                {trailingWord}
                {closingMarker}
            </span>
        </code>
    )
}

export { MarkdownInlineCode }
