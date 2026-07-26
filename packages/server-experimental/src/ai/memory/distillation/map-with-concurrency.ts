/**
 * Run async work over items, optionally with a concurrency cap.
 *
 * @remarks When `concurrency` is omitted, runs all items via `Promise.allSettled`
 * (preferred for paid OpenRouter models). Pass a cap only if provider/DDoS
 * limits force it.
 */
const mapWithConcurrency = async <T, R>(
    items: T[],
    concurrency: number | undefined,
    mapper: (item: T, index: number) => Promise<R>
): Promise<PromiseSettledResult<R>[]> => {
    if (items.length === 0) return []

    if (concurrency === undefined)
        return Promise.allSettled(
            items.map((item, index) => mapper(item, index))
        )

    if (concurrency < 1) throw new Error("Concurrency must be >= 1.")

    const results: PromiseSettledResult<R>[] = new Array(items.length)
    let nextIndex = 0

    const workerCount = Math.min(concurrency, items.length)

    const workers = Array.from({ length: workerCount }, async () => {
        while (nextIndex < items.length) {
            const index = nextIndex
            nextIndex += 1

            try {
                results[index] = {
                    status: "fulfilled",
                    value: await mapper(items[index] as T, index)
                }
            } catch (reason) {
                results[index] = { status: "rejected", reason }
            }
        }
    })

    await Promise.all(workers)

    return results
}

export { mapWithConcurrency }
