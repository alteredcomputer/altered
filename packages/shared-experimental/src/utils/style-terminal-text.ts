import { type InspectColor, styleText } from "node:util"
import { terminalTextAccentStyle } from "../config/preferences.ts"

type TerminalTextStyle = InspectColor

type StyleTerminalTextOptions = {
    style:
        | TerminalTextStyle[]
        | ((defaultTextStyle: TerminalTextStyle[]) => TerminalTextStyle[])
}

const defaultTextStyle = terminalTextAccentStyle

function styleTerminalText(text: string, options?: StyleTerminalTextOptions) {
    const resolvedTextStyle =
        typeof options?.style === "function"
            ? options.style(defaultTextStyle)
            : (options?.style ?? defaultTextStyle)

    return styleText(resolvedTextStyle, text)
}

export {
    type StyleTerminalTextOptions,
    styleTerminalText,
    type TerminalTextStyle
}
