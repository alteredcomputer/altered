import { error } from "@orpc/contract"
import { type } from "arktype"

const InternalServerAPIError = error("INTERNAL_SERVER_ERROR", {
    message: "Something went wrong on our end.",

    /**
     * @remarks Highly experimental structure, could likely improve.
     */
    data: type({
        why: "string",

        fix: "string"
    })
})

const BadRequestAPIError = error("BAD_REQUEST", {
    message: "The request that was received was not allowed."
})

const UnauthorizedAPIError = error("UNAUTHORIZED", {})

export { BadRequestAPIError, InternalServerAPIError, UnauthorizedAPIError }
