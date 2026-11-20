import { apiProcedureFactory } from "../../factory/index.ts"

const systemEchoApiProcedure = apiProcedureFactory.system.echo.handler(
    ({ input }) => ({
        message: input.message,

        processedAt: new Date()
    })
)

export { systemEchoApiProcedure }
