import { readdir, readFile, stat } from "node:fs/promises"
import { basename, extname, join } from "node:path"

const SUPPORTED_FILE_EXTENSIONS = new Set([".txt", ".md", ".markdown", ".mdc"])
const IGNORED_FILENAMES = new Set([".DS_Store"])

function isSupportedFileExtension(extension: string): boolean {
    return SUPPORTED_FILE_EXTENSIONS.has(extension.toLowerCase())
}

function isIgnoredFile(filePath: string): boolean {
    return IGNORED_FILENAMES.has(basename(filePath))
}

async function isDirectory(path: string): Promise<boolean> {
    try {
        return (await stat(path)).isDirectory()
    } catch {
        return false
    }
}

async function isFile(path: string): Promise<boolean> {
    try {
        return (await stat(path)).isFile()
    } catch {
        return false
    }
}

async function introspectDirectory(path: string): Promise<string[]> {
    const entries = await readdir(path, { withFileTypes: true })
    const nested = await Promise.all(
        entries.map(entry => {
            const fullPath = join(path, entry.name)

            if (entry.isDirectory()) return introspectDirectory(fullPath)
            if (entry.isFile() && !isIgnoredFile(fullPath))
                return Promise.resolve([fullPath])

            return Promise.resolve([])
        })
    )

    return nested.flat()
}

async function expandFilesystemPaths(paths: string[]): Promise<string[]> {
    const nested = await Promise.all(
        paths.map(async path => {
            if (await isDirectory(path)) return introspectDirectory(path)
            if (await isFile(path)) return [path]

            return []
        })
    )

    return nested.flat()
}

function readTextFile(filePath: string): Promise<string> {
    return readFile(filePath, "utf-8")
}

function getFileExtension(filePath: string): string {
    return extname(filePath)
}

export {
    expandFilesystemPaths,
    getFileExtension,
    isSupportedFileExtension,
    readTextFile
}
