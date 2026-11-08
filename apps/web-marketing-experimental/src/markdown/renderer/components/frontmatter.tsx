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

    return (
        <header className="grid">
            <MarkdownDecorativeGlyph>{"---"}</MarkdownDecorativeGlyph>

            {parsedYamlLines.map(
                ({ yamlLine, keyWithDelimiter, value }, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                    <p key={index}>
                        {keyWithDelimiter ? (
                            <>
                                <MarkdownDecorativeGlyph>
                                    {keyWithDelimiter}
                                </MarkdownDecorativeGlyph>

                                <span
                                    className={
                                        value === "null"
                                            ? "text-foreground/32-64"
                                            : "text-foreground"
                                    }
                                >
                                    {value}
                                </span>
                            </>
                        ) : (
                            yamlLine || nonBreakingSpace
                        )}
                    </p>
                )
            )}

            <MarkdownDecorativeGlyph>{"---"}</MarkdownDecorativeGlyph>
        </header>
    )
}

export { MarkdownFrontmatter }
