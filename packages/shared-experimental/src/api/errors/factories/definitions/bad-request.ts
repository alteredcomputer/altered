import { error } from "@orpc/contract"

const BadRequestAPIErrorFactory = error("BAD_REQUEST", {
    message: "The request that we received wasn't valid."
})

export { BadRequestAPIErrorFactory }
