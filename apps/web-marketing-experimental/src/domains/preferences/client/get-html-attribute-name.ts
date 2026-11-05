import {
    CLIENT_PREFERENCE_HTML_ATTRIBUTE_PREFIX,
    type ClientPreferenceHTMLAttributeName,
    type ClientPreferenceName
} from "./definitions"

function getClientPreferenceHtmlAttributeName(
    preferenceName: ClientPreferenceName
): ClientPreferenceHTMLAttributeName {
    return `${CLIENT_PREFERENCE_HTML_ATTRIBUTE_PREFIX}${preferenceName}`
}

export { getClientPreferenceHtmlAttributeName }
