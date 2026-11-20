import type { APIContract } from "@altered/shared-experimental/api/contract/index.ts"
import type { RouterContractClient } from "@orpc/contract"

type APIClient = RouterContractClient<APIContract>

export type { APIClient }
