import { join } from "node:path"
import { type } from "arktype"

const markdownFileExtensionPattern = /\.md$/

type MarkdownConfig = {
    rootDir: string
}

const defaultMarkdownConfig = {
    rootDir: join(process.cwd(), "src/content")
} as const satisfies MarkdownConfig

const markdownFrontmatterValuesSchema = type({
    "meta-title?": "string | null",
    "meta-description?": "string | null"
})

type MarkdownFrontmatterValues = typeof markdownFrontmatterValuesSchema.infer

export {
    defaultMarkdownConfig,
    type MarkdownConfig,
    type MarkdownFrontmatterValues,
    markdownFileExtensionPattern,
    markdownFrontmatterValuesSchema
}
