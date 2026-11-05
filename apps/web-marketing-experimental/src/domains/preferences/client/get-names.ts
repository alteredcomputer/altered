import {
    type ClientPreferenceName,
    clientPreferenceDefinitions
} from "./definitions"

function getClientPreferenceNames(): ClientPreferenceName[] {
    return Object.keys(clientPreferenceDefinitions) as ClientPreferenceName[]
}

export { getClientPreferenceNames }
