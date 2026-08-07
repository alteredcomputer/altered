import assert from "node:assert/strict"
import { after, before, describe, it } from "node:test"
import { ORPCError } from "@orpc/server"
import { verifyApiKey } from "./verify-api-key"

describe("verifyApiKey", () => {
    before(() => {
        process.env.SHARED_GENERATED_PROVIDER_INTERNAL_API_SECRET =
            "test-key-value"
    })

    after(() => {
        delete process.env.SHARED_GENERATED_PROVIDER_INTERNAL_API_SECRET
    })

    it("accepts a matching Bearer token", () => {
        assert.doesNotThrow(() => verifyApiKey("Bearer test-key-value"))
    })

    it("rejects a missing Authorization header", () => {
        assert.throws(() => verifyApiKey(null), ORPCError)
    })

    it("rejects a mismatched Bearer token", () => {
        assert.throws(() => verifyApiKey("Bearer wrong-key"), ORPCError)
    })

    it("rejects a non-Bearer scheme", () => {
        assert.throws(() => verifyApiKey("Basic test-key-value"), ORPCError)
    })
})
