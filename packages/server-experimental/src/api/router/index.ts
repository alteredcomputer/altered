import { apiFactory } from "../factory.ts"
import { apiErrorBoundaryMiddleware } from "../middleware/error-boundary.ts"
import { systemApiRouter } from "./system/index.ts"

const apiRouter = apiFactory.use(apiErrorBoundaryMiddleware).router({
    system: systemApiRouter
})

type APIRouter = typeof apiRouter

export { type APIRouter, apiRouter }
