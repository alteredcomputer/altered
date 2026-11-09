import {
    type ClientPreferenceName,
    clientPreferenceDefinitions
} from "./definitions"
import { getClientPreferenceHtmlAttributeName } from "./get-html-attribute-name"

type GetClientPreferenceValue = (params: {
    currentValue: string

    preferenceOptions: readonly string[]
}) => string

function setClientPreference({
    name,

    value
}: {
    name: ClientPreferenceName

    value: string | GetClientPreferenceValue
}) {
    const htmlElement = document.documentElement

    const preferenceOptions = clientPreferenceDefinitions[name]
    const preferenceAttributeName = getClientPreferenceHtmlAttributeName(name)

    const currentPreferenceValue =
        htmlElement.getAttribute(preferenceAttributeName) ??
        preferenceOptions[0]

    const newPreferenceValue =
        typeof value === "function"
            ? value({
                  currentValue: currentPreferenceValue,
                  preferenceOptions
              })
            : value

    htmlElement.setAttribute(preferenceAttributeName, newPreferenceValue)

    try {
        localStorage.setItem(name, newPreferenceValue)
    } catch {
        //  We ignore failures (that might happen if storage is unavailable) since the change will still apply to the current page regardless.
    }
}

export { setClientPreference }
