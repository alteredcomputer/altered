import {
    type ClientPreferenceName,
    clientPreferenceDefinitions,
    type DefaultClientPreferenceValue
} from "./definitions"

function getDefaultClientPreferenceValue<
    PreferenceName extends ClientPreferenceName = ClientPreferenceName
>(
    preferenceName: PreferenceName
): DefaultClientPreferenceValue<PreferenceName> {
    return clientPreferenceDefinitions[preferenceName][0]
}

export { getDefaultClientPreferenceValue }
