import { systemEchoApiProcedure } from "./echo.ts"

const systemApiRouter = {
    echo: systemEchoApiProcedure
}

export { systemApiRouter }
