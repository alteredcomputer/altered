import type { Yaml } from "mdast"
import { MarkdownFrontmatter } from "../components/frontmatter"

function renderMarkdownYamlNode(ast: Yaml) {
    return <MarkdownFrontmatter yaml={ast.value} />
}

export { renderMarkdownYamlNode }
