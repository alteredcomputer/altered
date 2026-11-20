import { createORPCClient } from "@orpc/client"
import type { APIClient } from "../client.ts"
import { apiRpcFetchLink } from "./link/fetch.ts"

const apiRpcClient: APIClient = createORPCClient(apiRpcFetchLink)

export { apiRpcClient }
