import {
    type ClientPreferenceName,
    clientPreferenceDefinitions
} from "./definitions"

const isClientPreferenceName = (name: string): name is ClientPreferenceName =>
    name in clientPreferenceDefinitions

export { isClientPreferenceName }
