import type { ReactNode } from "react"
import { MarkdownChildOrCopyableBreak } from "./child-or-copyable-break"

function MarkdownBlankLine({ children }: { children?: ReactNode }) {
    return (
        <div data-markdown-line>
            <MarkdownChildOrCopyableBreak>
                {children}
            </MarkdownChildOrCopyableBreak>
        </div>
    )
}

export { MarkdownBlankLine }
