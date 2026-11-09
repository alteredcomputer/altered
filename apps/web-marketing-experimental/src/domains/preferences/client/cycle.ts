import type { ClientPreferenceName } from "./definitions"
import { setClientPreference } from "./set"
import { traverseCollection } from "./utils/traverse-collection"

function cycleClientPreference({
    preferenceName
}: {
    preferenceName: ClientPreferenceName
}) {
    setClientPreference({
        name: preferenceName,

        value: ({ currentValue, preferenceOptions }) =>
            traverseCollection({
                source: preferenceOptions,
                cursor: currentValue,
                direction: "next"
            })
    })
}

export { cycleClientPreference }
