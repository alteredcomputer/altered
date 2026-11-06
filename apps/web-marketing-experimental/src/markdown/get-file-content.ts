import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { Root } from "mdast"
import type { MarkdownConfig } from "./definitions"
import { markdownFilePathToRouteSegments } from "./file-path-to-route-segments"
import { getMarkdownFilePaths } from "./get-file-paths"
import { parseMarkdown } from "./parse"

type GetMarkdownFileContentQueryOptions =
    | {
          filePath: string
      }
    | {
          routeSegments: string[]
      }

type GetMarkdownFileContentOptions = {
    query: GetMarkdownFileContentQueryOptions

    config: MarkdownConfig
}

function getMarkdownFileContent({
    query,
    config
}: GetMarkdownFileContentOptions): Root {
    let resolvedFilePath: string

    if ("routeSegments" in query) {
        const filePaths = getMarkdownFilePaths({ config })

        const isRouteSegmentsMatchingFilePath = ({
            routeSegments,
            filePath
        }: {
            routeSegments: string[]
            filePath: string
        }) => {
            const filePathRouteSegments =
                markdownFilePathToRouteSegments(filePath)

            return routeSegments.join("/") === filePathRouteSegments.join("/")
        }

        const matchingFilePath = filePaths.find(filePath =>
            isRouteSegmentsMatchingFilePath({
                routeSegments: query.routeSegments,
                filePath
            })
        )

        if (!matchingFilePath)
            throw new Error(
                "No file was found matching the given route segments."
            )

        resolvedFilePath = matchingFilePath
    } else {
        if (!("filePath" in query))
            throw new Error(
                "Either `filePath` or `routeSegments` must be provided."
            )

        resolvedFilePath = query.filePath
    }

    const fileContent = readFileSync(
        join(config.rootDir, resolvedFilePath),
        "utf8"
    )

    const mdast = parseMarkdown({ content: fileContent })

    return mdast
}

export { getMarkdownFileContent }
