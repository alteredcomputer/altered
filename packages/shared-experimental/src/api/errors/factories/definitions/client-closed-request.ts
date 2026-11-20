import { error } from "@orpc/contract"

const ClientClosedRequestAPIErrorFactory = error("CLIENT_CLOSED_REQUEST", {
    message: "The client closed the request before we were able to respond."
})

export { ClientClosedRequestAPIErrorFactory }
