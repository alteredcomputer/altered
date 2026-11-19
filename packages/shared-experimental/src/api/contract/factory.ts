import { oc } from "@orpc/contract"
import { apiErrorFactoryMap } from "../errors/factories/map.ts"

const apiContractFactory = oc.errors(apiErrorFactoryMap)

export { apiContractFactory }
