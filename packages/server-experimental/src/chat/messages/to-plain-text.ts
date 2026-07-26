/**
 * Flatten message content to plain text. Non-text parts are ignored.
 */
const toPlainText = (content: unknown): string => {
    if (typeof content === "string") return content

    if (!Array.isArray(content)) return ""

    return content
        .map(part =>
            part &&
            typeof part === "object" &&
            "type" in part &&
            part.type === "text" &&
            "text" in part &&
            typeof part.text === "string"
                ? part.text
                : ""
        )
        .filter(Boolean)
        .join("\n")
}

export { toPlainText }
