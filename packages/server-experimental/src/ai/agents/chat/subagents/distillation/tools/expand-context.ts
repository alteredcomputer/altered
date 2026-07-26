import { tool } from "ai"
import { type } from "arktype"
import { expandSourceContext } from "../source/expand"
import { ensurePreviousSource } from "../source/previous"
import { getContext, getCurrentChunk } from "./context"
import type { DistillationToolOptions } from "./options"
import { findOverlappingThoughts, type TextSegment } from "./overlaps"

const createExpandContextTool = (options: DistillationToolOptions) =>
    tool({
        title: "Expand Context",
        description:
            "Expand before/after the current chunk by characters, words, or chunks. Automatically reaches into the previous source when expanding past the start.",

        type: "function",
        strict: true,

        inputSchema: type({
            direction: type("'before' | 'after' | 'both'").describe(
                "Which side of the chunk to expand.",
                "union"
            ),
            amount: type("number.integer > 0").describe(
                "How far to expand in the chosen unit."
            ),
            unit: type("'characters' | 'words' | 'chunks'").describe(
                "Expansion unit.",
                "union"
            )
        }),

        execute: async (input, { experimental_context }) => {
            const context = getContext(experimental_context)
            const { source, chunk } = getCurrentChunk(context)

            const expanded = expandSourceContext({
                source: source.text,
                start: chunk.start,
                end: chunk.end,
                direction: input.direction,
                amount: input.amount,
                unit: input.unit,
                chunks: source.chunks
            })

            const segments: TextSegment[] = [
                {
                    sourceIndex: source.index,
                    start: expanded.start,
                    end: expanded.end,
                    text: expanded.text
                }
            ]

            let note: string | undefined

            if (input.direction !== "after" && expanded.start === 0) {
                const previous = await ensurePreviousSource(
                    context,
                    options.fetchPreviousSource
                )

                if (previous) {
                    const tailCount =
                        input.unit === "chunks"
                            ? Math.max(1, input.amount - chunk.index)
                            : 1
                    const tail =
                        previous.chunks.at(-tailCount) ?? previous.chunks.at(0)

                    if (tail)
                        segments.unshift({
                            sourceIndex: previous.index,
                            start: tail.start,
                            end: previous.text.length,
                            text: previous.text.slice(tail.start)
                        })
                } else
                    note =
                        "Beginning of available sources - nothing exists earlier."
            }

            return {
                segments,
                previouslyDistilledThoughts: findOverlappingThoughts(
                    context,
                    segments
                ),
                ...(note ? { note } : {})
            }
        }
    })

export { createExpandContextTool }
