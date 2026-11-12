import type { Code } from "mdast"
import type { CSSProperties } from "react"
import {
    IS_MARKDOWN_CODE_BLOCK_PADDING_ENABLED,
    IS_MARKDOWN_WRAPPED_LINE_INDENT_ENABLED
} from "~/config/general"
import { MarkdownChildOrCopyableBreak } from "../components/child-or-copyable-break"
import { MarkdownDecorativeGlyph } from "../components/decorative-glyph"
import { emptyMarkdownLinePrefix } from "../components/line"
import type { MarkdownRendererNodeContext } from "./definitions"

/** @remarks Matches the wrapped line indent, which counts a tab as this many spaces. */
const markdownCodeTabSize = 4

type MarkdownCodeLine = {
    prefix: string
    fence?: string
    text: string
}

function renderMarkdownCodeNode(
    ast: Code,
    context: MarkdownRendererNodeContext
) {
    const linePrefix = context.linePrefix ?? emptyMarkdownLinePrefix

    const marker = ast.data?.marker ?? "```"

    /** @remarks An indented block's marker is its indent, and it has no fences. */
    const isFenced = marker.startsWith("`") || marker.startsWith("~")

    const openingCodeFenceInfo = [ast.lang, ast.meta].filter(Boolean).join(" ")

    const codeLines = ast.value
        .split("\n")
        .map(codeLine => (isFenced || !codeLine ? codeLine : marker + codeLine))

    const unprefixedLines: Omit<MarkdownCodeLine, "prefix">[] = [
        ...(isFenced ? [{ fence: marker, text: openingCodeFenceInfo }] : []),
        ...codeLines.map(codeLine => ({ text: codeLine })),
        ...(isFenced ? [{ fence: marker.trimEnd(), text: "" }] : [])
    ]

    /** @remarks An empty line keeps only its prefix's syntax, e.g. `>`. */
    const lines: MarkdownCodeLine[] = unprefixedLines.map((line, index) => {
        const prefix = index === 0 ? linePrefix.first : linePrefix.rest
        const isEmpty = !(line.fence || line.text)

        return { ...line, prefix: isEmpty ? prefix.trimEnd() : prefix }
    })

    return (
        /* The background starts after the containers' prefix (e.g. `> `), which is pulled out of the padded box by negative margin, so it stays aligned with the surrounding lines. `break-spaces` keeps a space with the word before it when wrapping, instead of letting it hang past the line's edge where selection would still highlight it. */
        <pre
            className={
                IS_MARKDOWN_CODE_BLOCK_PADDING_ENABLED
                    ? "relative isolate grid py-line whitespace-break-spaces"
                    : "relative isolate grid whitespace-break-spaces"
            }
            style={
                {
                    tabSize: markdownCodeTabSize,
                    "--markdown-code-prefix-width": `${linePrefix.rest.length}ch`,
                    "--markdown-code-padding":
                        IS_MARKDOWN_CODE_BLOCK_PADDING_ENABLED ? "2ch" : "0ch"
                } as CSSProperties
            }
        >
            <span
                aria-hidden="true"
                className="bg-foreground/4-64 absolute inset-y-0px-rem right-0px-rem left-(--markdown-code-prefix-width) -z-1"
            />

            <code className="text-foreground/32-64 grid">
                {lines.map(({ prefix, fence, text }, index) => {
                    const leadingWhitespace = text.slice(
                        0,
                        text.length - text.trimStart().length
                    )
                    const leadingWhitespaceWidth = leadingWhitespace.replaceAll(
                        "\t",
                        " ".repeat(markdownCodeTabSize)
                    ).length

                    return (
                        /* With the wrapped line indent, the line is padded by its own leading whitespace and its first line is pulled back by the same amount, so wrapped lines continue at the code's indentation (like VS Code) while the text itself is untouched. */
                        <span
                            className="pr-[calc(var(--markdown-code-padding)+1ch)] pl-[calc(var(--markdown-code-prefix-width)+var(--markdown-code-padding)+var(--markdown-code-line-indent))] -indent-(--markdown-code-line-indent)"
                            data-markdown-line
                            // biome-ignore lint/suspicious/noArrayIndexKey: Constant array.
                            key={index}
                            style={
                                {
                                    "--markdown-code-line-indent":
                                        IS_MARKDOWN_WRAPPED_LINE_INDENT_ENABLED &&
                                        !fence
                                            ? `${leadingWhitespaceWidth}ch`
                                            : "0ch"
                                } as CSSProperties
                            }
                        >
                            {prefix ? (
                                <span className="mr-(--markdown-code-padding) -ml-[calc(var(--markdown-code-prefix-width)+var(--markdown-code-padding))] whitespace-pre">
                                    <MarkdownDecorativeGlyph>
                                        {prefix}
                                    </MarkdownDecorativeGlyph>
                                </span>
                            ) : null}

                            {fence ? (
                                <MarkdownDecorativeGlyph>
                                    {fence}
                                </MarkdownDecorativeGlyph>
                            ) : null}

                            {prefix || fence ? (
                                text
                            ) : (
                                <MarkdownChildOrCopyableBreak>
                                    {text}
                                </MarkdownChildOrCopyableBreak>
                            )}
                        </span>
                    )
                })}
            </code>
        </pre>
    )
}

export { renderMarkdownCodeNode }
