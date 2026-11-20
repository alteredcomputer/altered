import type { APIFactoryBuilder } from "../factory/builder.ts"

type CreateMiddlewareProps = {
    context: {
        builder: APIFactoryBuilder
    }
}

export type { CreateMiddlewareProps }
