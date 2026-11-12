import type { CSSProperties, HTMLAttributes, ReactNode } from "react"
import { IS_MARKDOWN_WRAPPED_LINE_INDENT_ENABLED } from "~/config/general"
import { MarkdownChildOrCopyableBreak } from "./child-or-copyable-break"
import { MarkdownDecorativeGlyph } from "./decorative-glyph"

/** @remarks The containers' syntax at the start of a line: `first` on a block's first line (e.g. `> - `), `rest` on every line after it (e.g. `>   `). */
type MarkdownLinePrefix = { first: string; rest: string }

const emptyMarkdownLinePrefix: MarkdownLinePrefix = { first: "", rest: "" }

/** @remarks With the wrapped line indent, a prefix hangs in its line's left padding, so wrapped lines continue after it. Without it, `--markdown-line-indent` is never set, so the padding and margin resolve to nothing. The padding is an inline style, since the line's class is the caller's. */
function MarkdownLinePrefixGlyph({ children }: { children: string }) {
    if (!children) return null

    return (
        <span className="-ml-(--markdown-line-indent) whitespace-pre">
            <MarkdownDecorativeGlyph>{children}</MarkdownDecorativeGlyph>
        </span>
    )
}

type MarkdownLineProps = HTMLAttributes<HTMLElement> & {
    as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    linePrefix?: MarkdownLinePrefix | undefined
    children?: ReactNode
}

/** @remarks One block that starts a source line, drawn with its containers' prefix. Lines are never nested, so containers only pass prefixes down. */
function MarkdownLine({
    as: Tag = "div",
    linePrefix = emptyMarkdownLinePrefix,
    className,
    children,
    style,
    ...attributes
}: MarkdownLineProps) {
    const indentStyle = IS_MARKDOWN_WRAPPED_LINE_INDENT_ENABLED
        ? { "--markdown-line-indent": `${linePrefix.rest.length}ch` }
        : {}

    const paddingStyle = { paddingLeft: "var(--markdown-line-indent)" }

    return (
        <Tag
            className={className}
            data-markdown-line
            style={
                { ...indentStyle, ...paddingStyle, ...style } as CSSProperties
            }
            {...attributes}
        >
            <MarkdownLinePrefixGlyph>
                {linePrefix.first}
            </MarkdownLinePrefixGlyph>

            {linePrefix.first ? (
                children
            ) : (
                <MarkdownChildOrCopyableBreak>
                    {children}
                </MarkdownChildOrCopyableBreak>
            )}
        </Tag>
    )
}

export {
    emptyMarkdownLinePrefix,
    MarkdownLine,
    type MarkdownLinePrefix,
    MarkdownLinePrefixGlyph
}
