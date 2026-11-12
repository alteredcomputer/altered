import type { MarkdownTransformOptions } from "./definitions"
import { readMarkdownSourceIntoNode } from "./read-source"
import { resolveMarkdownReferences } from "./resolve-references"
import { visitMarkdownNodes } from "./visit"

/** @remarks First reads what the source says into the tree and resolves references, then runs each rule as its own pass in array order, so a later rule sees and can override an earlier one's result. Mutates and returns the tree. */
function transformMarkdown({ mdast, source, rules }: MarkdownTransformOptions) {
    visitMarkdownNodes({
        node: mdast,
        source,
        visitor: readMarkdownSourceIntoNode
    })

    resolveMarkdownReferences({ mdast, source })

    for (const rule of rules)
        visitMarkdownNodes({
            node: mdast,
            source,
            visitor: match => {
                if (rule.find(match)) rule.transform(match)
            }
        })

    return mdast
}

export { transformMarkdown }
