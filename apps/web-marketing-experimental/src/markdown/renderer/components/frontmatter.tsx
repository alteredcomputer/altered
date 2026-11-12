import { markdownFrontmatterLinePattern } from "../definitions"
import { MarkdownDecorativeGlyph } from "./decorative-glyph"

function MarkdownFrontmatter({ yaml }: { yaml: string }) {
    const yamlLines = yaml.split("\n")

    const parsedYamlLines = yamlLines.map(yamlLine => {
        const [_wholeMatch, keyWithDelimiter, value] =
            yamlLine.match(markdownFrontmatterLinePattern) ?? []

        return {
            yamlLine,
            keyWithDelimiter,
            value
        }
    })

    const nonBreakingSpace = "\u00A0"

    const specialYamlValues = ["null", "true", "false"]

    return (
        <header className="grid">
            <div data-markdown-line="">
                <MarkdownDecorativeGlyph>{"---"}</MarkdownDecorativeGlyph>
            </div>

            {parsedYamlLines.map(
                ({ yamlLine, keyWithDelimiter, value }, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                    <div data-markdown-line="" key={index}>
                        {keyWithDelimiter ? (
                            <>
                                <span className="text-foreground/32-64">
                                    {keyWithDelimiter}
                                </span>

                                <span
                                    className={
                                        specialYamlValues.includes(value)
                                            ? "text-foreground/16-64"
                                            : "text-foreground/48-64"
                                    }
                                >
                                    {value}
                                </span>
                            </>
                        ) : (
                            yamlLine || nonBreakingSpace
                        )}
                    </div>
                )
            )}

            <div data-markdown-line="">
                <MarkdownDecorativeGlyph>{"---"}</MarkdownDecorativeGlyph>
            </div>
        </header>
    )
}

export { MarkdownFrontmatter }
