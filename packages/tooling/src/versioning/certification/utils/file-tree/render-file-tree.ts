import type { FileTreeNode } from "./create-file-tree"

type FileTreeLine = {
    text: string

    status: string | null
}

/**
 * @remarks Directories first, then alphabetical, like the VS Code explorer.
 */
function compareFileTreeNodes(a: FileTreeNode, b: FileTreeNode): number {
    const isADirectory = a.status === null
    const isBDirectory = b.status === null

    if (isADirectory !== isBDirectory) return isADirectory ? -1 : 1

    return a.name.localeCompare(b.name)
}

function getFileTreeLines({
    nodes,
    prefix,
    isRoot
}: {
    nodes: FileTreeNode[]
    prefix: string
    isRoot: boolean
}): FileTreeLine[] {
    const sortedNodes = nodes.toSorted(compareFileTreeNodes)

    return sortedNodes.flatMap((node, index) => {
        const isLast = index === sortedNodes.length - 1

        const branchConnector = isLast ? "└ " : "├ "
        const childConnector = isLast ? "  " : "│ "

        const connector = isRoot ? "" : branchConnector
        const childPrefix = isRoot ? "" : `${prefix}${childConnector}`

        const name = node.status === null ? `${node.name}/` : node.name

        return [
            { text: `${prefix}${connector}${name}`, status: node.status },

            ...getFileTreeLines({
                nodes: node.children,
                prefix: childPrefix,
                isRoot: false
            })
        ]
    })
}

function truncate(text: string, width: number): string {
    if (text.length <= width) return text

    return `${text.slice(0, width - 1)}…`
}

/**
 * @remarks Lines are truncated to `width` rather than wrapped, and statuses are right-aligned in a single column at the end of it.
 */
function renderFileTree({
    lines,
    width
}: {
    lines: FileTreeLine[]
    width: number
}): string[] {
    //  Reserves 2 characters for the space and status letter.

    const textWidth = width - 2

    return lines.map(({ text, status }) => {
        if (status === null) return truncate(text, width)

        return `${truncate(text, textWidth).padEnd(textWidth)} ${status}`
    })
}

export { type FileTreeLine, getFileTreeLines, renderFileTree }
