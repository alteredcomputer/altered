import type { CreateMiddlewareProps } from "../middleware/definitions.ts"
import { createApiErrorBoundaryMiddleware } from "../middleware/error-boundary.ts"
import { apiFactoryBuilder } from "./builder.ts"

const createMiddlewareProps = {
    context: { builder: apiFactoryBuilder }
} satisfies CreateMiddlewareProps

/**
 * @remarks Completely replaces `os` from "@orpc/server".
 */
const apiFactory = apiFactoryBuilder.use(
    createApiErrorBoundaryMiddleware(createMiddlewareProps)
)

export { apiFactory }
