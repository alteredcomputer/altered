import { tool } from "ai"
import { type } from "arktype"
import { searchSourceText } from "../source/search"
import { getContext, getCurrentChunk } from "./context"
import { findOverlappingThoughts } from "./overlaps"

const createSearchSourceTool = () =>
    tool({
        title: "Search Source",
        description:
            "Search all loaded sources for terms that may sit far from the current chunk.",

        type: "function",
        strict: true,

        inputSchema: type({
            terms: type("string[]").describe(
                "Words or phrases to find in the source text."
            )
        }),

        execute: ({ terms }, { experimental_context }) => {
            const context = getContext(experimental_context)
            const { chunk } = getCurrentChunk(context)

            const matches = context.sources.flatMap(source =>
                searchSourceText(source.text, terms, {
                    //  The current chunk is already in context, so only source 0 excludes it.
                    ...(source.index === 0
                        ? {
                              excludeRange: {
                                  start: chunk.start,
                                  end: chunk.end
                              }
                          }
                        : {})
                }).map(match => ({ sourceIndex: source.index, ...match }))
            )

            return {
                matches,
                previouslyDistilledThoughts: findOverlappingThoughts(
                    context,
                    matches.map(match => ({
                        sourceIndex: match.sourceIndex,
                        start: match.excerptStart,
                        end: match.excerptEnd,
                        text: match.excerpt
                    }))
                ),
                ...(matches.length === 0
                    ? {
                          note: "No matches - these terms do not exist in the loaded sources. Do not retry with variations; generalize instead."
                      }
                    : {})
            }
        }
    })

export { createSearchSourceTool }
