import { type } from "arktype"
import { apiContractFactory } from "../factory.ts"

const systemEchoApiProcedure = apiContractFactory
    .input(
        type({
            message: "string"
        })
    )
    .output(
        type({
            message: "string",

            processedAt: "Date"
        })
    )

export { systemEchoApiProcedure }
