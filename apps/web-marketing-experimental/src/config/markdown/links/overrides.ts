import { clearClientPreferences } from "~/domains/preferences/client/clear"
import { getClientPreferenceLinkOverrideLabelVariants } from "~/domains/preferences/client/get-link-override-label-variants"
import { cycleClientPreference } from "~/domains/preferences/client/set"
import type { MarkdownLinkOverrideConfig } from "~/markdown/renderer/links/definitions"

const markdownLinkOverrideConfig = [
    {
        find: ({ target }) => target.text === "action:cycle-color-scheme",

        label: getClientPreferenceLinkOverrideLabelVariants({
            preferenceName: "color-scheme"
        }),

        target: {
            action: () => cycleClientPreference({ name: "color-scheme" })
        }
    },
    {
        find: ({ target }) => target.text === "action:cycle-palette",

        label: getClientPreferenceLinkOverrideLabelVariants({
            preferenceName: "palette"
        }),

        target: {
            action: () => cycleClientPreference({ name: "palette" })
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
