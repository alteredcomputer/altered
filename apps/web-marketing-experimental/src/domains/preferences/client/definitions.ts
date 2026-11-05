/**
 * @remarks
 * - The first option of each preference is its default.
 * - These definitions must match those defined in `"apps/web-marketing-experimental/src/domains/preferences/client/styles.css"`.
 */
const clientPreferenceDefinitions = {
    "color-scheme": ["light dark", "light", "dark"],
    palette: ["color", "monochrome"]
} as const

type ClientPreferenceDefinitions = typeof clientPreferenceDefinitions
type ClientPreferenceName = keyof ClientPreferenceDefinitions

type DefaultClientPreferenceValue<
    PreferenceName extends ClientPreferenceName = ClientPreferenceName
> = ClientPreferenceDefinitions[PreferenceName][0]

const CLIENT_PREFERENCE_HTML_ATTRIBUTE_PREFIX = "data-preference-"

type ClientPreferenceHTMLAttributeName<
    PreferenceName extends ClientPreferenceName = ClientPreferenceName
> =
    `${typeof CLIENT_PREFERENCE_HTML_ATTRIBUTE_PREFIX}${PreferenceName & string}`

type DefaultClientPreferenceHTMLAttributes = {
    [PreferenceName in keyof ClientPreferenceDefinitions as ClientPreferenceHTMLAttributeName<PreferenceName>]: DefaultClientPreferenceValue<PreferenceName>
}

export {
    CLIENT_PREFERENCE_HTML_ATTRIBUTE_PREFIX,
    type ClientPreferenceHTMLAttributeName,
    type ClientPreferenceName,
    clientPreferenceDefinitions,
    type DefaultClientPreferenceHTMLAttributes,
    type DefaultClientPreferenceValue
}
