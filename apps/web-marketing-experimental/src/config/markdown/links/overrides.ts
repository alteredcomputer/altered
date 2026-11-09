import { clearClientPreferences } from "~/domains/preferences/client/clear"
import { cycleClientPreference } from "~/domains/preferences/client/cycle"
import { getClientPreferenceLinkOverrideLabelVariants } from "~/domains/preferences/client/get-link-override-label-variants"
import type { MarkdownLinkOverrideConfig } from "~/markdown/renderer/links/definitions"

const markdownLinkOverrideConfig = [
    {
        find: ({ target }) => target.text === "action:cycle-color-scheme",

        label: getClientPreferenceLinkOverrideLabelVariants({
            preferenceName: "color-scheme"
        }),

        target: {
            action: () =>
                cycleClientPreference({ preferenceName: "color-scheme" })
        }
    },
    {
        find: ({ target }) => target.text === "action:cycle-palette",

        label: getClientPreferenceLinkOverrideLabelVariants({
            preferenceName: "palette"
        }),

        target: {
            action: () => cycleClientPreference({ preferenceName: "palette" })
        }
    },
    {
        find: ({ target }) => target.text === "action:clear-preferences",

        target: {
            action: clearClientPreferences
        }
    }
] satisfies MarkdownLinkOverrideConfig[]

export { markdownLinkOverrideConfig }
