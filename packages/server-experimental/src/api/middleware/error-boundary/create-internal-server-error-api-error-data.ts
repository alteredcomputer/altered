import type { InternalServerErrorAPIErrorFactory } from "@altered/shared-experimental/api/errors/factories/definitions/internal-server-error.ts"
import { ORPCError, ValidationError } from "@orpc/server"

type CreateInternalServerErrorDataResult = NonNullable<
    (typeof InternalServerErrorAPIErrorFactory)["data"]["~standard"]["types"]
>["input"]

function createInternalServerErrorApiErrorData({
    error
}: {
    error: unknown
}): CreateInternalServerErrorDataResult {
    const isOutputValidationError =
        error instanceof ORPCError && error.cause instanceof ValidationError

    if (isOutputValidationError)
        return { why: "The server processed the request in an unexpected way." }

    const isErrorFactoryDataValidationError = error instanceof ValidationError

    if (isErrorFactoryDataValidationError)
        return { why: "The server couldn't describe the error it hit." }

    return { why: "The server hit an unexpected error." }
}

export { createInternalServerErrorApiErrorData }
