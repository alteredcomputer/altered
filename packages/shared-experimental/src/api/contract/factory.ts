import { oc } from "@orpc/contract"
import { apiErrorMap } from "../errors/map.ts"

const apiContractFactory = oc.errors(apiErrorMap)

export { apiContractFactory }
