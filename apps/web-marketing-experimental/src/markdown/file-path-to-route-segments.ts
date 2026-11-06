import { markdownFileExtensionPattern } from "./definitions"

function markdownFilePathToRouteSegments(filePath: string): string[] {
    const routeSegments = filePath
        .replace(markdownFileExtensionPattern, "")
        .split("/")

    if (routeSegments.at(-1) === "index") {
        const routeSegmentsWithoutIndex = routeSegments.slice(0, -1)

        return routeSegmentsWithoutIndex
    }

    return routeSegments
}

export { markdownFilePathToRouteSegments }
