function isEnvironment({ platform }: { platform: "vercel" }): boolean {
    let isSpecifiedPlatform: boolean

    switch (platform) {
        case "vercel":
            isSpecifiedPlatform = process.env.VERCEL === "1"

            break

        default:
            isSpecifiedPlatform = false
    }

    return isSpecifiedPlatform
}

export { isEnvironment }
