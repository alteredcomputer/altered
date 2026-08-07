import { environment, getPreferenceValues } from "@raycast/api"

type ExtensionPreferences = {
    apiBaseUrl?: string
    apiKey?: string
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
 * preference, defaults to the local generated API on `LOCAL_GENERATED_API_PORT`.
 * Optional prefs may be `undefined` from Raycast - never call string methods bare.
 */
function resolveApiBaseUrl(): string {
    const preferred = (getExtensionPreferences().apiBaseUrl ?? "")
        .trim()
        .replace(TRAILING_SLASH, "")

    if (preferred) return preferred

    if (environment.isDevelopment)
        return `http://127.0.0.1:${LOCAL_GENERATED_API_PORT}`

    throw new Error(
        "Set Generated API Base URL in extension preferences for non-development builds."
    )
}

function resolveApiKey(): string {
    const apiKey = (getExtensionPreferences().apiKey ?? "").trim()

    if (!apiKey)
        throw new Error("Set Internal API Key in extension preferences.")

    return apiKey
}

export type { ExtensionPreferences }
export { getExtensionPreferences, resolveApiBaseUrl, resolveApiKey }
