import { watch } from "node:fs"
import { defaultMarkdownConfig } from "~/markdown/definitions"

function GET(request: Request) {
    if (process.env.NODE_ENV !== "development")
        return new Response(null, { status: 404 })

    const textEncoder = new TextEncoder()

    const changeStream = new ReadableStream({
        start(streamController) {
            const fileWatcher = watch(
                defaultMarkdownConfig.rootDir,

                { recursive: true },

                () =>
                    streamController.enqueue(
                        textEncoder.encode("data: change\n\n")
                    )
            )

            request.signal.addEventListener("abort", () => {
                fileWatcher.close()

                streamController.close()
            })
        }
    })

    return new Response(changeStream, {
        headers: {
            "Cache-Control": "no-cache",

            "Content-Type": "text/event-stream"
        }
    })
}

export { GET }
