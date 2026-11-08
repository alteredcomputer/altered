import type { MarkdownLinkOverrideLabelVariant } from "~/markdown/renderer/links/definitions"
import {
    type ClientPreferenceName,
    clientPreferenceDefinitions
} from "./definitions"

function getClientPreferenceLinkOverrideLabelVariants({
    preferenceName
}: {
    preferenceName: ClientPreferenceName
}): MarkdownLinkOverrideLabelVariant[] {
    return clientPreferenceDefinitions[preferenceName].map(
        preferenceOption => ({
            text: preferenceOption,

            attributes: {
                "data-preference-name": `${preferenceName}=${preferenceOption}`
            }
        })
    )
}

export { getClientPreferenceLinkOverrideLabelVariants }
