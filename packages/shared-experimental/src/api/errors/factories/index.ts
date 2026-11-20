import { BadRequestAPIErrorFactory } from "./definitions/bad-request.ts"
import { ClientClosedRequestAPIErrorFactory } from "./definitions/client-closed-request.ts"
import { InternalServerErrorAPIErrorFactory } from "./definitions/internal-server-error.ts"
import { UnauthorizedAPIErrorFactory } from "./definitions/unauthorized.ts"

const apiErrorFactories = [
    BadRequestAPIErrorFactory,
    ClientClosedRequestAPIErrorFactory,
    InternalServerErrorAPIErrorFactory,
    UnauthorizedAPIErrorFactory
]

export { apiErrorFactories }
