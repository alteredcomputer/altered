import { BASE_URL } from "~/config/general"

const allowedMarkdownLinkTargetUrlProtocols = [
    "http:",
    "https:",

    "tel:",
    "sms:",
    "mailto:"
]

function assertValidMarkdownLinkTargetUrl(url: string) {
    const parsedUrl = URL.parse(url, BASE_URL)

    const isValidUrl =
        url &&
        parsedUrl &&
        allowedMarkdownLinkTargetUrlProtocols.includes(parsedUrl.protocol)

    if (!isValidUrl)
        throw new Error(
            `Invalid markdown link target URL '${url}': not a parseable URL or allowed protocol.`
        )
}

export {
    type allowedMarkdownLinkTargetUrlProtocols,
    assertValidMarkdownLinkTargetUrl
}
