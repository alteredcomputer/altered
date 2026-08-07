import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createRawThought } from "./create"
import { createRawThoughtsMany } from "./create-many"
import { listRawThoughts } from "./list"

const databaseUrl = process.env.GENERATED_DATABASE_URL?.trim()

describe("raw thoughts data access", { skip: !databaseUrl }, () => {
    it("creates then lists a raw thought", async () => {
        const content = `test-thought-${Date.now()}`

        const created = await createRawThought({ content })

        assert.equal(created.content, content)
        assert.ok(created.id)

        const listed = await listRawThoughts({ limit: 50 })

        assert.ok(listed.some(thought => thought.id === created.id))
    })

    it("creates many raw thoughts", async () => {
        const stamp = Date.now()
        const contents = [`many-a-${stamp}`, `many-b-${stamp}`]

        const created = await createRawThoughtsMany({ contents })

        assert.equal(created.length, 2)
        assert.ok(created.every(thought => contents.includes(thought.content)))
    })
})
