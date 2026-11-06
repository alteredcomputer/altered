import { readdirSync } from "node:fs"
import { basename } from "node:path"
import type { MarkdownConfig } from "./definitions"

function getMarkdownFilePaths({
    config
}: {
    config: MarkdownConfig
}): string[] {
    const filePaths = readdirSync(config.rootDir, {
        encoding: "utf8",
        recursive: true
    })

    const isMarkdownFilePath = (path: string) => path.endsWith(".md")
    const isIgnoredFilePath = (path: string) => basename(path).startsWith("_")

    const resolvedFilePaths = filePaths.filter(
        path => isMarkdownFilePath(path) && !isIgnoredFilePath(path)
    )

    return resolvedFilePaths
}

export { getMarkdownFilePaths }
