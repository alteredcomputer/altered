import { oc } from "@orpc/contract"
import { apiErrorFactoryMap } from "../errors/factories/map/index.ts"

const apiContractFactory = oc.errors(apiErrorFactoryMap)

export { apiContractFactory }
