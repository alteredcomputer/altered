type MessageWindowFrom = "oldest" | "newest"

type SelectMessageWindowOptions = {
    from?: MessageWindowFrom
    limit?: number
    offset?: number
    page?: number
}

/**
 * Slice a chronologically ordered message list for reindex testing.
 *
 * @remarks Input must be oldest-first. `--page` is 1-based and requires `--limit`.
 */
const selectMessageWindow = <T>(
    messages: T[],
    options: SelectMessageWindowOptions = {}
): T[] => {
    const from = options.from ?? "oldest"

    if (options.page !== undefined) {
        if (options.page < 1) throw new Error("--page must be >= 1.")

        if (options.limit === undefined)
            throw new Error("--page requires --limit.")

        if (options.offset !== undefined)
            throw new Error("Use either --page or --offset, not both.")
    }

    if (options.limit !== undefined && options.limit < 1)
        throw new Error("--limit must be >= 1.")

    if (options.offset !== undefined && options.offset < 0)
        throw new Error("--offset must be >= 0.")

    const ordered = from === "newest" ? messages.slice().reverse() : messages

    const offset =
        options.page === undefined
            ? (options.offset ?? 0)
            : (options.page - 1) * (options.limit as number)

    if (options.limit === undefined) return ordered.slice(offset)

    return ordered.slice(offset, offset + options.limit)
}

export {
    type MessageWindowFrom,
    type SelectMessageWindowOptions,
    selectMessageWindow
}
