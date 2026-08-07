import { environment, getPreferenceValues } from "@raycast/api"

type ExtensionPreferences = {
    apiBaseUrl: string
    apiKey: string
}

/**
 * @remarks Must match local `API_CONFIG_PORT` when running `pnpm dev:generated`.
 */
const LOCAL_GENERATED_API_PORT = 4200

const TRAILING_SLASH = /\/$/

function getExtensionPreferences(): ExtensionPreferences {
    return getPreferenceValues<ExtensionPreferences>()
}

/**
 * @remarks Preference wins when set. In Raycast development with an empty
 * preference, defaults to the local generated API on port 3000.
 */
function resolveApiBaseUrl(): string {
    const preferred = getExtensionPreferences()
        .apiBaseUrl.trim()
        .replace(TRAILING_SLASH, "")

    if (preferred) return preferred

    if (environment.isDevelopment)
        return `http://127.0.0.1:${LOCAL_GENERATED_API_PORT}`

    throw new Error(
        "Set Generated API Base URL in extension preferences for non-development builds."
    )
}

export type { ExtensionPreferences }
export { getExtensionPreferences, resolveApiBaseUrl }
