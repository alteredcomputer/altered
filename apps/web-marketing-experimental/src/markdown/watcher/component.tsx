"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

const markdownWatcherApiPath = "/api/dev/markdown/watcher"

const refreshDebounceMs = 250

function _MarkdownWatcher() {
    // biome-ignore lint/correctness/useHookAtTopLevel: False positive.
    const router = useRouter()

    // biome-ignore lint/correctness/useHookAtTopLevel: False positive.
    useEffect(() => {
        const changeStream = new EventSource(markdownWatcherApiPath)

        let refreshDebounceTimeout: ReturnType<typeof setTimeout> | undefined

        changeStream.onmessage = () => {
            clearTimeout(refreshDebounceTimeout)

            refreshDebounceTimeout = setTimeout(
                () => router.refresh(),

                refreshDebounceMs
            )
        }

        return () => {
            clearTimeout(refreshDebounceTimeout)

            changeStream.close()
        }
    }, [router])

    return null
}

function MarkdownWatcher() {
    if (process.env.NODE_ENV !== "development") return null

    return <_MarkdownWatcher />
}

export { MarkdownWatcher }
