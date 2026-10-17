import type { GitDiffFileChange } from "../get-diff-file-changes"

type FileTreeNode = {
    name: string

    /**
     * @remarks `null` for directories.
     */
    status: string | null

    children: FileTreeNode[]
}

function createFileTree({
    fileChanges
}: {
    fileChanges: GitDiffFileChange[]
}): FileTreeNode[] {
    const rootNodes: FileTreeNode[] = []

    for (const { statusLetter, path } of fileChanges) {
        const segments = path.split("/")

        const directoryNames = segments.slice(0, -1)
        const fileName = segments.at(-1) ?? path

        let siblingNodes = rootNodes

        for (const directoryName of directoryNames) {
            let directoryNode = siblingNodes.find(
                node => node.status === null && node.name === directoryName
            )

            if (!directoryNode) {
                directoryNode = {
                    name: directoryName,
                    status: null,
                    children: []
                }

                siblingNodes.push(directoryNode)
            }

            siblingNodes = directoryNode.children
        }

        siblingNodes.push({ name: fileName, status, children: [] })
    }

    return rootNodes
}

export { createFileTree, type FileTreeNode }
