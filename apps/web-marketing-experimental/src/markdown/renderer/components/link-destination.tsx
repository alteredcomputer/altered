/** @remarks A link's closing marker, e.g. `](/koa "Title")`. The label's `]` wraps like text, and the rest wraps at any character, since destinations are long and moving each to its own line looks choppy. */
function MarkdownLinkDestination({ closingMarker }: { closingMarker: string }) {
    const [labelEnd, destination] = closingMarker.startsWith("]")
        ? ["]", closingMarker.slice(1)]
        : ["", closingMarker]

    return (
        <>
            {labelEnd}
            <span className="break-all">{destination}</span>
        </>
    )
}

export { MarkdownLinkDestination }
