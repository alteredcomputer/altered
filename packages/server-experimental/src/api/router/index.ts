import { apiFactory } from "../factory/index.ts"
import { systemApiRouter } from "./system/index.ts"

const apiRouter = apiFactory.router({
    system: systemApiRouter
})

type APIRouter = typeof apiRouter

export { type APIRouter, apiRouter }
