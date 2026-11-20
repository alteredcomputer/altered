import { apiRpcPathPrefix } from "@altered/shared-experimental/config/tmp.ts"
import { onError } from "@orpc/server"
import { RPCHandler } from "@orpc/server/fetch"
import { apiRouter } from "../../router/index.ts"

const apiRpcFetchHandler = new RPCHandler(apiRouter, {
    interceptors: [onError(error => console.error(error))]
})

function handleApiRpcFetchRequest(request: Request) {
    return apiRpcFetchHandler.handle(request, {
        prefix: apiRpcPathPrefix,

        context: {
            request: {
                headers: request.headers
            }
        }
    })
}

export { handleApiRpcFetchRequest }
