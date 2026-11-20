import {
    apiDevelopmentServerOrigin,
    apiRpcPathPrefix
} from "@altered/shared-experimental/config/tmp.ts"
import { RPCLink } from "@orpc/client/fetch"

const apiRpcFetchLink = new RPCLink({
    origin: apiDevelopmentServerOrigin,

    url: apiRpcPathPrefix
})

export { apiRpcFetchLink }
