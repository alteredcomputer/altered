import type { Backlink } from "../../ai/agents/chat/subagents/distillation/backlinks"
import type { DistillationSource } from "../../ai/agents/chat/subagents/distillation/context"
import type { PersistedBacklink } from "./persisted-backlinks"

/**
 * Resolves run-local `sourceIndex` backlinks onto durable source ids.
 *
 * @remarks Distillation currently only loads chat messages; raw-thought sources come later.
 */
const toPersistedBacklinks = (
    sources: DistillationSource[],
    backlinks: Backlink[]
): PersistedBacklink[] =>
    backlinks.map(backlink => ({
        kind: backlink.kind,

        parts: backlink.parts.map(part => {
            const source = sources.find(
                entry => entry.index === part.sourceIndex
            )

            if (!source)
                throw new Error(
                    `Missing source index ${part.sourceIndex} while persisting backlinks.`
                )

            return {
                source: { type: "chat-message" as const, id: source.id },
                start: part.start,
                end: part.end
            }
        })
    }))

export { toPersistedBacklinks }
