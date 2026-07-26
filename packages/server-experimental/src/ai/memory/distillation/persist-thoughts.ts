import { indexThoughtKeywords } from "../../../models/thoughts/index-keywords"
import { saveDerivedThought } from "../../../models/thoughts/save-derived"
import { toPersistedBacklinks } from "../../../models/thoughts/to-persisted-backlinks"
import type {
    CollectedThought,
    DistillationSource
} from "../../agents/chat/subagents/distillation/context"

const persistCollectedThoughts = async (
    sources: DistillationSource[],
    thoughts: CollectedThought[]
): Promise<string[]> => {
    const savedThoughtIds: string[] = []

    for (const thought of thoughts) {
        const saved = await saveDerivedThought({
            content: thought.content,
            backlinks: toPersistedBacklinks(sources, thought.backlinks)
        })

        savedThoughtIds.push(saved.id)
    }

    return savedThoughtIds
}

const indexThoughtIds = async (
    thoughtIds: string[]
): Promise<Record<string, string[]>> => {
    const indexedKeywords: Record<string, string[]> = {}

    for (const thoughtId of thoughtIds) {
        const indexed = await indexThoughtKeywords(thoughtId)

        indexedKeywords[thoughtId] = indexed.keywords
    }

    return indexedKeywords
}

export { indexThoughtIds, persistCollectedThoughts }
