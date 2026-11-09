import { getDefaultClientPreferenceHtmlAttributes } from "./get-default-html-attributes"
import { getClientPreferenceNames } from "./get-names"

function clearClientPreferences() {
    const htmlElement = document.documentElement

    const defaultPreferenceAttributes = Object.entries(
        getDefaultClientPreferenceHtmlAttributes()
    )

    for (const [
        preferenceAttributeName,
        preferenceAttributeValue
    ] of defaultPreferenceAttributes)
        htmlElement.setAttribute(
            preferenceAttributeName,
            preferenceAttributeValue
        )

    const preferenceNames = getClientPreferenceNames()

    try {
        for (const preferenceName of preferenceNames)
            localStorage.removeItem(preferenceName)
    } catch {
        //  We ignore failures (that might happen if storage is unavailable) since nothing was likely stored in that case anyways.
    }
}

export { clearClientPreferences }
