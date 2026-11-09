function traverseCollection<Item>({
    source,
    cursor,
    direction
}: {
    source: readonly Item[]

    cursor: Item

    direction: "next" | "previous"
}): Item {
    const cursorIndex = source.indexOf(cursor)
    const cursorNotInSource = cursorIndex === -1

    if (cursorNotInSource)
        throw new Error(
            "Failed to traverse collection: cursor not in source.",
            { cause: cursor }
        )

    const indexOffset = direction === "next" ? 1 : -1

    const wrappedTargetIndex =
        (cursorIndex + indexOffset + source.length) % source.length

    return source[wrappedTargetIndex]
}

export { traverseCollection }
