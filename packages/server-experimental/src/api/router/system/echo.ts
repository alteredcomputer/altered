import { apiFactory } from "../../factory.ts"

const systemEchoApiProcedure = apiFactory.system.echo.handler(({ input }) => ({
    message: input.message,

    processedAt: new Date()
}))

export { systemEchoApiProcedure }
