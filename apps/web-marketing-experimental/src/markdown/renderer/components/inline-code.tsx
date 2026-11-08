import type { ReactNode } from "react"

function MarkdownInlineCode({ children }: { children: ReactNode }) {
    return (
        <code className="bg-foreground/8-64 text-foreground/32-64">
            {"`"}
            {children}
            {"`"}
        </code>
    )
}

export { MarkdownInlineCode }
