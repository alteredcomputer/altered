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

type APIProcedureErrors = InferRouterContractErrors<APIContract>
type APIError = InferRouterContractError<APIContract>

export {
    type APIContract,
    type APIError,
    type APIInputs,
    type APIOutputs,
    type APIProcedureErrors,
    apiContract
}
