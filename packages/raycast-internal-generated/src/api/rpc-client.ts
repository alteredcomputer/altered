import type { RpcRouter } from "@altered/api-generated/rpc/router"
import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { getExtensionPreferences, resolveApiBaseUrl } from "./preferences"

const link = new RPCLink({
    origin: () => resolveApiBaseUrl(),

    url: "/rpc",

    headers: () => {
        const { apiKey } = getExtensionPreferences()

        return {
            authorization: `Bearer ${apiKey}`
        }
    }
})

const client: RouterClient<RpcRouter> = createORPCClient(link)

export { client }
