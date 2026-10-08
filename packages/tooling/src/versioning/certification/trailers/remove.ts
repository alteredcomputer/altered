import { readFileSync, writeFileSync } from "node:fs"
import { CERTIFICATION_TRAILER_KEYS } from "./definitions"

/**
 * @remarks Git's built-in `--if-exists replace` only replaces one occurrence per trailer-key, which is not adequate for edge cases caused by inconsistent message formatting or content.
 */
function removeCommitCertificationMessageTrailers({
    messageFilePath
}: {
    messageFilePath: string
}): void {
    const message = readFileSync(messageFilePath, "utf8")

    const lines = message.split("\n")

    const linesWithoutCertificationTrailers = lines.filter(
        line =>
            !CERTIFICATION_TRAILER_KEYS.some(key => line.startsWith(`${key}:`))
    )

    const remainingMessage = linesWithoutCertificationTrailers.join("\n")

    writeFileSync(messageFilePath, `${remainingMessage.trimEnd()}\n`, "utf8")
}

export { removeCommitCertificationMessageTrailers }
