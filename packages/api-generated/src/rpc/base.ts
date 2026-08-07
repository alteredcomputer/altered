import { os } from "@orpc/server"
import { verifyApiKey } from "../auth/verify-api-key"
import type { RpcContext } from "./context"

const base = os.$context<RpcContext>()

const authed = base.use(({ context, next }) => {
    verifyApiKey(context.headers.get("authorization"))

    return next()
})

export { authed, base }
