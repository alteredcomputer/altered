import { apiContract } from "@altered/shared-experimental/api/contract/index.ts"
import { implement } from "@orpc/server"
import type { APIRequestContext } from "../context.ts"

/**
 * @remarks For constructing middleware. Use `apiFactory` for routers and procedures.
 */
const apiFactoryBuilder = implement(apiContract).$context<APIRequestContext>()

type APIFactoryBuilder = typeof apiFactoryBuilder

export { type APIFactoryBuilder, apiFactoryBuilder }
