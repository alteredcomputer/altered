import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { defaultMarkdownConfig } from "~/markdown/definitions"
import { getAllMarkdownPageRouteSegments } from "~/markdown/get-all-page-route-segments"
import { getMarkdownFileContent } from "~/markdown/get-file-content"
import { getMdastFrontmatterValues } from "~/markdown/get-frontmatter-values-from-parsed"
import { Markdown } from "~/markdown/render"

function generateStaticParams() {
    const allRouteSegments = getAllMarkdownPageRouteSegments({
        config: defaultMarkdownConfig
    })

    const allPageParams = allRouteSegments.map(routeSegments => ({
        "route-segments": routeSegments
    }))

    return allPageParams
}

async function generateMetadata({
    params
}: PageProps<"/[[...route-segments]]">): Promise<Metadata> {
    const { "route-segments": routeSegments = [] } = await params

    const mdast = getMarkdownFileContent({
        query: { routeSegments },
        config: defaultMarkdownConfig
    })

    const { "meta-title": title, "meta-description": description } =
        getMdastFrontmatterValues(mdast)

    return {
        ...(title ? { title } : {}),
        ...(description ? { description } : {})
    }
}

async function MarkdownPage({ params }: PageProps<"/[[...route-segments]]">) {
    const { "route-segments": routeSegments = [] } = await params

    const mdast = getMarkdownFileContent({
        query: { routeSegments },
        config: defaultMarkdownConfig
    })

    if (!mdast) notFound()

    const viewOptionsMdast = getMarkdownFileContent({
        query: { filePath: "_view-options.md" },
        config: defaultMarkdownConfig
    })

    return (
        <main className="grid justify-items-center px-gutter py-section">
            <div className="grid w-full max-w-measure gap-line">
                <Markdown root={mdast} />

                <Markdown root={viewOptionsMdast} />
            </div>
        </main>
    )
}

export { generateMetadata, generateStaticParams }

export default MarkdownPage
