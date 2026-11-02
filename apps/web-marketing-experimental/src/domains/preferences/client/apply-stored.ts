import { clientPreferenceDefinitions } from "./definitions"

function serializable_applyStoredClientPreferences(
    preferenceDefinitions: Record<string, string[]>
) {
    const preferenceEntries = Object.entries(preferenceDefinitions)

    for (const [preferenceName, preferenceOptions] of preferenceEntries) {
        try {
            const localPreferenceValue = localStorage.getItem(preferenceName)

            if (
                localPreferenceValue &&
                preferenceOptions.includes(localPreferenceValue)
            ) {
                const preferenceAttributeName = `data-preference-${preferenceName}`

                const htmlElement = document.documentElement

                htmlElement.setAttribute(
                    preferenceAttributeName,
                    localPreferenceValue
                )
            }
        } catch {
            //  If storage is unavailable for any reason (e.g., blocked), nothing is set and the defaults are used.
        }
    }
}

const applyStoredClientPreferencesScript = `(${serializable_applyStoredClientPreferences.toString()})(${JSON.stringify(clientPreferenceDefinitions)})`

export { applyStoredClientPreferencesScript }
