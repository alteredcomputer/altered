import { timingSafeEqual } from "node:crypto"
import { ORPCError } from "@orpc/server"

/**
 * @remarks Single-admin Bearer check for the internal cockpit (S10).
 * Better Auth session/API-key plugin replaces this when web-generated lands.
 */
function verifyApiKey(authorization: string | null | undefined): void {
    const expected =
        process.env.SHARED_GENERATED_PROVIDER_INTERNAL_API_SECRET?.trim()

    if (!expected)
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message:
                "'SHARED_GENERATED_PROVIDER_INTERNAL_API_SECRET' environment variable is missing."
        })

    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length).trim()
        : null

    if (!token) throw new ORPCError("UNAUTHORIZED")

    const provided = Buffer.from(token)
    const required = Buffer.from(expected)

    if (
        provided.length !== required.length ||
        !timingSafeEqual(provided, required)
    )
        throw new ORPCError("UNAUTHORIZED")
}

export { verifyApiKey }
