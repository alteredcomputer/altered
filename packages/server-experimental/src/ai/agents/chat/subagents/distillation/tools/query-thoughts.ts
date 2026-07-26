import { tool } from "ai"
import { type } from "arktype"

/**
 * @todo P1: Unstub once the memory-query pipeline (Plan B) lands - it should return existing brain thoughts related to the chunk so duplicates become updates instead of new rows.
 */
const createQueryThoughtsTool = () =>
    tool({
        title: "Query Thoughts",
        description:
            "Query the ALTERED brain for existing thoughts related to the current chunk. Always called first.",

        type: "function",
        strict: true,

        inputSchema: type({
            query: type("string").describe(
                "What to look up about the current chunk."
            )
        }),

        execute: () => ({
            thoughts: [],
            note: "Memory querying is not implemented yet - proceed using source context only."
        })
    })

export { createQueryThoughtsTool }
