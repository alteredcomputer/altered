import type { Code } from "mdast"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"

function renderMarkdownCodeNode(ast: Code) {
    const codeFence = "```"

    const openingCodeFenceInfo = [ast.lang, ast.meta].filter(Boolean).join(" ")

    const codeLines = ast.value.split("\n")

    return (
        <pre className="whitespace-pre-wrap">
            <code className="bg-foreground/4-64 text-foreground/32-64 grid">
                <span data-markdown-line>
                    <MarkdownDecorativeGlyph>
                        {codeFence}
                    </MarkdownDecorativeGlyph>

                    {openingCodeFenceInfo}
                </span>

                {codeLines.map((codeLine, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                    <span data-markdown-line key={index}>
                        {codeLine || <br />}
                    </span>
                ))}

                <span data-markdown-line>
                    <MarkdownDecorativeGlyph>
                        {codeFence}
                    </MarkdownDecorativeGlyph>
                </span>
            </code>
        </pre>
    )
}

export { renderMarkdownCodeNode }
