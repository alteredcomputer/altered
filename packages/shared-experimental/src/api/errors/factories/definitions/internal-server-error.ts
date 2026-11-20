import { error } from "@orpc/contract"
import { type } from "arktype"

const InternalServerErrorAPIErrorFactory = error("INTERNAL_SERVER_ERROR", {
    message: "Something went wrong on our end.",

    /**
     * @remarks Highly experimental structure, could likely improve.
     */
    data: type({
        why: "string",

        fix: type("string").default(
            "This is on our end. Try again, and report it if it keeps happening."
        )
    })
})

export { InternalServerErrorAPIErrorFactory }
