import { resolveEnvironment } from "@altered/core-experimental/config/routing"

/**
 * @remarks Generated-tier origins use `API_GENERATED_ORIGIN_*` (not the experimental `API_ORIGIN_*`).
 */
function resolveGeneratedApiOrigin(): string {
    const env = resolveEnvironment({ target: "api" })

    const origin = process.env[`API_GENERATED_ORIGIN_${env}`]?.trim()

    if (origin) return origin

    if (env === "development") {
        const port = process.env.API_CONFIG_PORT?.trim()

        if (!port)
            throw new Error(
                "'API_CONFIG_PORT' environment variable is missing."
            )

        return `http://127.0.0.1:${port}`
    }

    throw new Error(
        `'API_GENERATED_ORIGIN_${env}' environment variable is missing.`
    )
}

export { resolveGeneratedApiOrigin }
