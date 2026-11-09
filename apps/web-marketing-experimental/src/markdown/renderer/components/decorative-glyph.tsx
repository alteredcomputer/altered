import type { ReactNode } from "react"

function MarkdownDecorativeGlyph({ children }: { children: ReactNode }) {
    return (
        <span aria-hidden="true" className="text-foreground/32-64">
            {children}
        </span>
    )
}

export { MarkdownDecorativeGlyph }
