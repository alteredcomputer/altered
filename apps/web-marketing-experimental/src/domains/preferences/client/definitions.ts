/**
 * @remarks Must match the options defined in `./styles.css`.
 */
const clientPreferenceDefinitions = {
    "color-scheme": ["light dark", "light", "dark"],
    palette: ["color", "monochrome"]
} as const

type ClientPreferenceName = keyof typeof clientPreferenceDefinitions

export { type ClientPreferenceName, clientPreferenceDefinitions }
