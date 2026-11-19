import { apiContract } from "@altered/shared-experimental/api/contract/index.ts"
import { implement } from "@orpc/server"
import type { APIContext } from "./context.ts"

/**
 * @remarks Completely replaces `os` from "@orpc/server".
 */
const apiFactory = implement(apiContract).$context<APIContext>()

export { apiFactory }
