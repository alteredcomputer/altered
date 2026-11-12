import type { MarkdownTransformRule } from "~/markdown/transform/definitions"
import {
    alignListItemMarkers,
    capBlankLinesBefore,
    ensureBlankLinesAfter,
    ensureBlankLinesAround,
    ensureBlankLinesBefore,
    replaceMarker
} from "~/markdown/transform/utilities"

/* Demo: remove when done. */
const dashListItemMarkerPattern = /^-\s+$/
/* End of demo. */

/** @remarks The content is formatted by a general-purpose formatter (Biome), so the opinions it doesn't share live here: each rule adjusts what was read from the source before the renderer, which renders whatever the tree says. Rules run as passes in order, so later rules win. */
const markdownTransformRules: MarkdownTransformRule[] = [
    {
        name: "2 Lines After Frontmatter",
        description:
            "Ensures a minimum of 2 blank lines after a frontmatter block.",

        find: ({ node }) => node.type === "yaml",
        transform: match => ensureBlankLinesAfter(match, { minimum: 2 })
    },
    {
        name: "2 Lines Before Headings",
        description: "Ensures a minimum of 2 blank lines before a heading.",

        find: ({ node }) => node.type === "heading",
        transform: match => ensureBlankLinesBefore(match, { minimum: 2 })
    },
    {
        name: "Lines Around Top-Level Lists",
        description:
            "Ensures a minimum of 1 blank line before and 2 after a list, unless it's nested in another list.",

        find: ({ node, parent }) =>
            node.type === "list" && parent?.type !== "listItem",
        transform: match => {
            ensureBlankLinesBefore(match, { minimum: 1 })
            ensureBlankLinesAfter(match, { minimum: 2 })
        }
    },
    {
        name: "2 Lines Around Thematic Breaks",
        description:
            "Ensures a minimum of 2 blank lines before and after a `---` divider.",

        find: ({ node }) => node.type === "thematicBreak",
        transform: match => ensureBlankLinesAround(match, { minimum: 2 })
    },
    {
        name: "Asterisk Emphasis",
        description: "Shows `_italic_` as `*italic*`.",

        find: ({ node }) => node.type === "emphasis",
        transform: match => replaceMarker(match, { from: "_", to: "*" })
    },
    {
        name: "Asterisk Strong",
        description: "Shows `__bold__` as `**bold**`.",

        find: ({ node }) => node.type === "strong",
        transform: match => replaceMarker(match, { from: "__", to: "**" })
    },
    {
        name: "Aligned Ordered List Markers",
        description:
            "Pads ordered list markers to the widest in their list, so `9.` and `10.` items line up.",

        find: ({ node }) => node.type === "list" && node.ordered === true,
        transform: alignListItemMarkers
    },

    /* Demo: remove when done. */
    {
        name: "Arrow List Items",
        description:
            "Shows every `-` list item prefix, whatever its spacing, as `-> `.",

        find: ({ node }) => node.type === "listItem",
        transform: match =>
            replaceMarker(match, { from: dashListItemMarkerPattern, to: "-> " })
    },
    /* End of demo. */

    {
        name: "At Most 2 Blank Lines",
        description:
            "Caps every gap at 2 blank lines, whether from the source or a rule above. Runs last so it has the final say.",

        find: () => true,
        transform: match => capBlankLinesBefore(match, { maximum: 2 })
    }
]

export { markdownTransformRules }
