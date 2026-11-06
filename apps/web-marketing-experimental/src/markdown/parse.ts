import type { Root } from "mdast"
import { fromMarkdown } from "mdast-util-from-markdown"
import { frontmatterFromMarkdown } from "mdast-util-frontmatter"
import { frontmatter } from "micromark-extension-frontmatter"

function parseMarkdown({ content }: { content: string }): Root {
    return fromMarkdown(content, {
        extensions: [frontmatter(["yaml"])],
        mdastExtensions: [frontmatterFromMarkdown(["yaml"])]
    })
}

export { parseMarkdown }
