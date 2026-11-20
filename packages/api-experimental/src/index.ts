import { handleApiRpcFetchRequest } from "@altered/server-experimental/api/rpc/handler/fetch.ts"
import {
    apiDevelopmentServerOrigin,
    apiDevelopmentServerPort,
    apiRpcPathPrefix
} from "@altered/shared-experimental/config/api.ts"
import { styleTerminalText } from "@altered/shared-experimental/utils/style-terminal-text.ts"
import { Hono } from "hono"
import { logger } from "hono/logger"

class ALTEREDAPI extends Hono {
    constructor() {
        super()

        this.use(
            logger((message: string, ...rest: string[]) => {
                const newMessage = message
                    .replace("<--", styleTerminalText(">>>"))
                    .replace("-->", styleTerminalText("<<<"))

                console.log(newMessage, ...rest)
            })
        )

        this.use(`${apiRpcPathPrefix}/*`, async (context, next) => {
            const handlerResult = await handleApiRpcFetchRequest(
                context.req.raw
            )

            const {
                matched: wasRequestMatched,

                response
            } = handlerResult

            if (wasRequestMatched)
                return context.newResponse(response.body, response)

            await next()
        })
    }

    async serve() {
        const { serve: serveHono } = await import("@hono/node-server")

        return serveHono(
            {
                fetch: this.fetch,
                port: apiDevelopmentServerPort
            },

            _addressInfo =>
                console.log(
                    `Server started at: ${styleTerminalText(
                        apiDevelopmentServerOrigin,
                        {
                            style: defaultStyle => [
                                ...defaultStyle,

                                "underline"
                            ]
                        }
                    )}`
                )
        )
    }
}

export { ALTEREDAPI }
