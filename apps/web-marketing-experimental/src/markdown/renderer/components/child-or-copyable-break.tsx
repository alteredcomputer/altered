import type { ReactNode } from "react"

/** @remarks An empty line element has no height and copies as nothing, so it falls back to a `<br>`, which is one line tall and copies as exactly one newline. */
function MarkdownChildOrCopyableBreak({ children }: { children?: ReactNode }) {
    const isEmpty =
        children === undefined ||
        children === null ||
        children === false ||
        children === ""

    return isEmpty ? <br /> : children
}

export { MarkdownChildOrCopyableBreak }
