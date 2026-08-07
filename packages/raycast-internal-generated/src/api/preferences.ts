import { getPreferenceValues } from "@raycast/api"

type ExtensionPreferences = {
    apiBaseUrl: string
    apiKey: string
}

function getExtensionPreferences(): ExtensionPreferences {
    return getPreferenceValues<ExtensionPreferences>()
}

export type { ExtensionPreferences }
export { getExtensionPreferences }
