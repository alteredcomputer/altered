import { name, version } from "@altered/core-experimental/config/app"
import { RPCHandler } from "@orpc/server/fetch"
import { Hono } from "hono"
import { rpcRouter } from "../rpc/router"

const handler = new RPCHandler(rpcRouter)

const app = new Hono()

app.get("/", context =>
    context.json({
        name: `${name} API (generated)`,
        version,
        status: "ok"
    })
)

app.all("/rpc/*", async context => {
    const { matched, response } = await handler.handle(context.req.raw, {
        prefix: "/rpc",
        context: {
            headers: context.req.raw.headers
        }
    })

    if (matched) return response

    return context.text("Not found", 404)
})

export { app as router }
