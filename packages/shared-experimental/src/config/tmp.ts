import type { TerminalTextStyle } from "../utils/style-terminal-text.ts"

const apiRpcPathPrefix = "/infra/rpc"

const apiDevelopmentServerPort = 25_800
const apiDevelopmentServerOrigin = `http://localhost:${apiDevelopmentServerPort}`

const terminalTextAccentStyle = ["green"] as const satisfies TerminalTextStyle[]

export {
    apiDevelopmentServerOrigin,
    apiDevelopmentServerPort,
    apiRpcPathPrefix,
    terminalTextAccentStyle
}
