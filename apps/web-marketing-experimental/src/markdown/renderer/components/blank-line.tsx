import type { ReactNode } from "react"

function MarkdownBlankLine({ children }: { children?: ReactNode }) {
    return <div data-markdown-line>{children ?? <br />}</div>
}

export { MarkdownBlankLine }
