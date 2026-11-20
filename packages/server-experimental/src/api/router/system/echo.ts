import { apiFactory } from "../../factory/index.ts"

const systemEchoApiProcedure = apiFactory.system.echo.handler(({ input }) => ({
    message: input.message,

    processedAt: new Date()
}))

export { systemEchoApiProcedure }
