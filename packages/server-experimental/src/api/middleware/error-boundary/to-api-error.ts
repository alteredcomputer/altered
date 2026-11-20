import { ClientClosedRequestAPIErrorFactory } from "@altered/shared-experimental/api/errors/factories/definitions/client-closed-request.ts"
import { InternalServerErrorAPIErrorFactory } from "@altered/shared-experimental/api/errors/factories/definitions/internal-server-error.ts"
import type { ORPCError } from "@orpc/server"
import { createInternalServerErrorApiErrorData } from "./create-internal-server-error-api-error-data.ts"
import { isApiError } from "./is-api-error.ts"

function toApiError({
    error,
    signal
}: {
    error: unknown
    signal?: AbortSignal
}): ORPCError<string, unknown> {
    if (signal?.aborted === true)
        return new ClientClosedRequestAPIErrorFactory({ cause: error })

    if (isApiError(error)) return error

    return new InternalServerErrorAPIErrorFactory({
        data: createInternalServerErrorApiErrorData({ error }),

        cause: error
    })
}

export { toApiError }
