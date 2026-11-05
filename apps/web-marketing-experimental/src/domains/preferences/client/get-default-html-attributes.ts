import type { DefaultClientPreferenceHTMLAttributes } from "./definitions"
import { getDefaultClientPreferenceValue } from "./get-default-value"
import { getClientPreferenceHtmlAttributeName } from "./get-html-attribute-name"
import { getClientPreferenceNames } from "./get-names"

function getDefaultClientPreferenceHtmlAttributes(): DefaultClientPreferenceHTMLAttributes {
    const defaultPreferenceAttributes = getClientPreferenceNames().map(
        preferenceName => {
            const preferenceAttributeName =
                getClientPreferenceHtmlAttributeName(preferenceName)

            const defaultPreferenceValue =
                getDefaultClientPreferenceValue(preferenceName)

            return [preferenceAttributeName, defaultPreferenceValue] as const
        }
    )

    return Object.fromEntries(
        defaultPreferenceAttributes
    ) as DefaultClientPreferenceHTMLAttributes
}

export { getDefaultClientPreferenceHtmlAttributes }
