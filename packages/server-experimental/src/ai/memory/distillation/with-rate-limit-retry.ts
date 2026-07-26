const sleep = (ms: number): Promise<void> =>
    new Promise(resolve => {
        setTimeout(resolve, ms)
    })

const isRetryableRateLimitError = (error: unknown): boolean => {
    if (!error || typeof error !== "object") {
        const text = String(error).toLowerCase()

        return text.includes("rate limit") || text.includes("too many requests")
    }

    const candidate = error as {
        statusCode?: unknown
        status?: unknown
        code?: unknown
        message?: unknown
    }

    if (candidate.statusCode === 429 || candidate.status === 429) return true
    if (candidate.code === 429 || candidate.code === "429") return true

    const message = String(candidate.message ?? "").toLowerCase()

    return (
        message.includes("rate limit") || message.includes("too many requests")
    )
}

type WithRateLimitRetryOptions = {
    maxAttempts?: number
    baseDelayMs?: number
    maxDelayMs?: number
    onRetry?: (input: {
        attempt: number
        maxAttempts: number
        delayMs: number
        error: unknown
    }) => void
}

/**
 * Retry transient OpenRouter/provider 429s with exponential backoff + jitter.
 */
const withRateLimitRetry = async <T>(
    run: () => Promise<T>,
    options: WithRateLimitRetryOptions = {}
): Promise<T> => {
    const maxAttempts = options.maxAttempts ?? 6
    const baseDelayMs = options.baseDelayMs ?? 1000
    const maxDelayMs = options.maxDelayMs ?? 60_000

    let attempt = 0

    while (true) {
        try {
            return await run()
        } catch (error) {
            attempt += 1

            if (!isRetryableRateLimitError(error) || attempt >= maxAttempts)
                throw error

            const exponential = baseDelayMs * 2 ** (attempt - 1)
            const jitter = Math.floor(Math.random() * 250)
            const delayMs = Math.min(maxDelayMs, exponential + jitter)

            options.onRetry?.({ attempt, maxAttempts, delayMs, error })

            await sleep(delayMs)
        }
    }
}

export { isRetryableRateLimitError, withRateLimitRetry }
