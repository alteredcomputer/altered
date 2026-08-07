import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { client } from "./rpc-client"

const api = createTanstackQueryUtils(client)

export { api }
