import type { CreateMiddlewareProps } from "../middleware/definitions.ts"
import { createApiErrorBoundaryMiddleware } from "../middleware/error-boundary/index.ts"
import { apiFactoryBuilder } from "./builder.ts"

const createMiddlewareProps = {
    context: { builder: apiFactoryBuilder }
} satisfies CreateMiddlewareProps

/**
 * @remarks Applies global middleware once to avoid duplication.
 */
const apiRootRouterFactory = apiFactoryBuilder.use(
    createApiErrorBoundaryMiddleware(createMiddlewareProps)
)

const apiProcedureFactory = apiFactoryBuilder

export { apiProcedureFactory, apiRootRouterFactory }
