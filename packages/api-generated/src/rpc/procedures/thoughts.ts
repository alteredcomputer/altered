import { createRawThought } from "@altered/server-generated/thoughts/create"
import { createRawThoughtsMany } from "@altered/server-generated/thoughts/create-many"
import { listRawThoughts } from "@altered/server-generated/thoughts/list"
import { type } from "arktype"
import { authed } from "../base"

const create = authed
    .input(type({ content: "string > 0" }))
    .handler(async ({ input }) => createRawThought({ content: input.content }))

const createMany = authed
    .input(
        type({
            contents: type("string > 0").array().atLeastLength(1)
        })
    )
    .handler(async ({ input }) =>
        createRawThoughtsMany({ contents: input.contents })
    )

const list = authed
    .input(
        type({
            "limit?": "number.integer >= 1"
        })
    )
    .handler(({ input }) => {
        const limit = Math.min(input.limit ?? 50, 100)

        return listRawThoughts({ limit })
    })

export { create, createMany, list }
