import type {
    InferRouterContractError,
    InferRouterContractErrors,
    InferRouterContractInputs,
    InferRouterContractOutputs
} from "@orpc/contract"
import { systemApiContract } from "./system/index.ts"

const apiContract = {
    system: systemApiContract
}

type APIContract = typeof apiContract

type APIInputs = InferRouterContractInputs<APIContract>
type APIOutputs = InferRouterContractOutputs<APIContract>

type APIErrorDefinitions = InferRouterContractErrors<APIContract>
type APIError = InferRouterContractError<APIContract>

export {
    type APIContract,
    type APIError,
    type APIErrorDefinitions,
    type APIInputs,
    type APIOutputs,
    apiContract
}
