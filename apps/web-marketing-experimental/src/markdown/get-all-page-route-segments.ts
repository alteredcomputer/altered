import type { MarkdownConfig } from "./definitions"
import { markdownFilePathToRouteSegments } from "./file-path-to-route-segments"
import { getMarkdownFilePaths } from "./get-file-paths"

function getAllMarkdownPageRouteSegments({
    config
}: {
    config: MarkdownConfig
}): string[][] {
    const filePaths = getMarkdownFilePaths({ config })

    const allRouteSegments = filePaths.map(markdownFilePathToRouteSegments)

    return allRouteSegments
}

export { getAllMarkdownPageRouteSegments }
