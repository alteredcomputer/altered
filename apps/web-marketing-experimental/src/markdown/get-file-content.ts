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

type GetMarkdownFileContentResult =
    | {
          data: { mdast: Root }

          error: null
      }
    | {
          data: null

          error: {
              message: string
              cause: Record<string, unknown>
          }
      }

function getMarkdownFileContent({
    query,
    config
}: GetMarkdownFileContentOptions): GetMarkdownFileContentResult {
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
            return {
                data: null,

                error: {
                    message:
                        "No file was found matching the given route segments.",
                    cause: { routeSegments: query.routeSegments }
                }
            }

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

    return {
        data: { mdast },

        error: null
    }
}

export { getMarkdownFileContent }
