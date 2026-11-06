import { ArkErrors } from "arktype"
import type { Root } from "mdast"
import { parse as parseYaml } from "yaml"
import {
    type MarkdownFrontmatterValues,
    markdownFrontmatterValuesSchema
} from "./definitions"

function getMdastFrontmatterValues(mdast: Root): MarkdownFrontmatterValues {
    const [firstNode] = mdast.children

    const hasFrontMatter = firstNode?.type === "yaml"
    if (!hasFrontMatter) return {}

    const parsedValues = parseYaml(firstNode.value)

    const validatedValues = markdownFrontmatterValuesSchema(parsedValues)

    if (validatedValues instanceof ArkErrors)
        throw new Error(
            `Could not parse markdown frontmatter: '${validatedValues.summary}'.`
        )

    return validatedValues
}

export { getMdastFrontmatterValues }
