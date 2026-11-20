import { unstable_tryCatch } from "@altered/shared-experimental/utils/try-catch.ts"
import type { CreateMiddlewareProps } from "../definitions.ts"
import { toApiError } from "./to-api-error.ts"

function createApiErrorBoundaryMiddleware(props: CreateMiddlewareProps) {
    return props.context.builder.middleware(
        async ({ context, signal, next }) => {
            const { data, error } = await unstable_tryCatch(() =>
                next({ context })
            )

            if (!error) return data

            throw toApiError({
                error,
                signal
            })
        }
    )
}

export { createApiErrorBoundaryMiddleware }
