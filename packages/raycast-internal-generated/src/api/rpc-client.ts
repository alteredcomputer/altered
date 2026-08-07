import type { RpcRouter } from "@altered/api-generated/rpc/router"
import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { getExtensionPreferences } from "./preferences"

const TRAILING_SLASH = /\/$/

const link = new RPCLink({
    origin: () => {
        const { apiBaseUrl } = getExtensionPreferences()

        return apiBaseUrl.replace(TRAILING_SLASH, "")
    },

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
