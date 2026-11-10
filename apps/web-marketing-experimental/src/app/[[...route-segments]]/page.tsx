import type { Metadata } from "next"
import { notFound } from "next/navigation"
// biome-ignore lint/correctness/noUnresolvedImports: False positive.
import { Suspense } from "react"
import { defaultMarkdownConfig } from "~/markdown/definitions"
import { getAllMarkdownPageRouteSegments } from "~/markdown/get-all-page-route-segments"
import { getMarkdownFileContent } from "~/markdown/get-file-content"
import { getMdastFrontmatterValues } from "~/markdown/get-frontmatter-values-from-parsed"
import { MarkdownRenderer } from "~/markdown/renderer"

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

    const { data: markdownFileData } = getMarkdownFileContent({
        query: { routeSegments },
        config: defaultMarkdownConfig
    })

    if (!markdownFileData) notFound()
    const { mdast } = markdownFileData

    const { "meta-title": title, "meta-description": description } =
        getMdastFrontmatterValues(mdast)

    return {
        ...(title ? { title } : {}),
        ...(description ? { description } : {})
    }
}

async function DynamicMarkdownContent({
    pageParams
}: {
    pageParams: PageProps<"/[[...route-segments]]">["params"]
}) {
    const { "route-segments": routeSegments = [] } = await pageParams

    const { data: markdownFileData } = getMarkdownFileContent({
        query: { routeSegments },
        config: defaultMarkdownConfig
    })

    if (!markdownFileData) notFound()
    const { mdast } = markdownFileData

    return <MarkdownRenderer ast={mdast} />
}

function MarkdownPage({ params }: PageProps<"/[[...route-segments]]">) {
    const { data: loadingMarkdownFileData } = getMarkdownFileContent({
        query: { filePath: "_loading.md" },
        config: defaultMarkdownConfig
    })

    const { data: viewOptionsMarkdownFileData } = getMarkdownFileContent({
        query: { filePath: "_view-options.md" },
        config: defaultMarkdownConfig
    })

    if (!loadingMarkdownFileData || !viewOptionsMarkdownFileData) notFound()

    const { mdast: loadingMdast } = loadingMarkdownFileData,
        { mdast: viewOptionsMdast } = viewOptionsMarkdownFileData

    return (
        <main className="grid justify-items-center px-gutter py-section">
            <div className="grid w-full max-w-measure gap-line">
                <Suspense fallback={<MarkdownRenderer ast={loadingMdast} />}>
                    <DynamicMarkdownContent pageParams={params} />
                </Suspense>

                <MarkdownRenderer ast={viewOptionsMdast} />
            </div>
        </main>
    )
}

export { generateMetadata, generateStaticParams }

export default MarkdownPage
