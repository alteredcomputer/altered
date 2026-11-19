import { ORPCError, ValidationError } from "@orpc/server"
import { apiFactory } from "../factory.ts"

function getInternalServerErrorReason({ error }: { error: unknown }): string {
    return "The server hit an unexpected error."
}

const apiErrorBoundaryMiddleware = apiFactory.middleware(
    async ({ next, signal, errors: errorFactoryMap }) => {
        try {
            return await next()
        } catch (caughtError) {
            if (signal?.aborted) throw caughtError

            const errorFactories = Object.values(errorFactoryMap)
            const isErrorFactoryError = errorFactories.some(
                errorFactory => caughtError instanceof errorFactory
            )

            if (isErrorFactoryError) throw caughtError

            const isFrameworkError =
                caughtError instanceof ORPCError &&
                caughtError.code !== "INTERNAL_SERVER_ERROR"

            if (isFrameworkError) throw caughtError

            const internalServerErrorReason = getInternalServerErrorReason({
                error: caughtError
            })

            throw errorFactoryMap.INTERNAL_SERVER_ERROR({
                data: {
                    why: internalServerErrorReason
                },

                cause: caughtError
            })
        }
    }
)

export { apiErrorBoundaryMiddleware }
