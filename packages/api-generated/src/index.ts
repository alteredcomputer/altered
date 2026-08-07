import { styleTerminalText } from "@altered/core-experimental/misc/style-terminal-text"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { customLogger } from "./misc/custom-logger"
import { resolveGeneratedApiOrigin } from "./misc/resolve-generated-api-origin"
import { router } from "./routers"

class ALTEREDAPIGenerated extends Hono {
    constructor() {
        super()

        this.use(logger(customLogger))
        this.route("/", router)
    }

    async serve() {
        const port = Number(process.env.API_CONFIG_PORT)

        if (Number.isNaN(port))
            throw new Error(
                "'API_CONFIG_PORT' environment variable is invalid."
            )

        const origin = resolveGeneratedApiOrigin()

        const { serve } = await import("@hono/node-server")

        return serve(
            {
                fetch: this.fetch,
                port
            },
            _ =>
                console.log(
                    `Generated API started at: ${styleTerminalText(
                        origin,
                        defaultStyle => [...defaultStyle, "underline"]
                    )}`
                )
        )
    }
}

export default ALTEREDAPIGenerated
export type { RpcRouter } from "./rpc/router"
