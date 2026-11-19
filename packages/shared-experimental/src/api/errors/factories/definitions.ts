import { error } from "@orpc/contract"
import { type } from "arktype"

const InternalServerErrorAPIErrorFactory = error("INTERNAL_SERVER_ERROR", {
    message: "Something went wrong on our end.",

    /**
     * @remarks Highly experimental structure, could likely improve.
     */
    data: type({
        why: "string",

        fix: "string"
    })
})

const BadRequestAPIErrorFactory = error("BAD_REQUEST", {
    message: "The request that we received wasn't valid."
})

const UnauthorizedAPIErrorFactory = error("UNAUTHORIZED")

export {
    BadRequestAPIErrorFactory,
    InternalServerErrorAPIErrorFactory,
    UnauthorizedAPIErrorFactory
}
