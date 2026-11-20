import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { apiRpcClient } from "../rpc/client.ts"

const apiQueryUtils = createTanstackQueryUtils(apiRpcClient)

export { apiQueryUtils }
