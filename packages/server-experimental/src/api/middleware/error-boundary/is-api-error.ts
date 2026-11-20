import { apiErrorFactoryMap } from "@altered/shared-experimental/api/errors/factories/map/index.ts"
import type { ORPCError } from "@orpc/server"

const apiErrorFactories = Object.values(apiErrorFactoryMap)

function isApiError(error: unknown): error is ORPCError<string, unknown> {
    return apiErrorFactories.some(
        apiErrorFactory => error instanceof apiErrorFactory
    )
}

export { isApiError }
