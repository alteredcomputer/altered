import { getDatabase } from "../../storage/database/connection"
import { backlinks } from "../backlinks/storage/schema"
import { getOrCreateDerivedDataset } from "../datasets/get-or-create-derived"
import { thoughtsToDatasets } from "../thoughts-to-datasets/storage/schema"
import {
    type PersistedBacklink,
    toBacklinkInsertValues
} from "./persisted-backlinks"
import { type Thought, thoughts } from "./storage/schema"

type SaveDerivedThoughtInput = {
    content: string
    backlinks: PersistedBacklink[]
    brainId?: string | null
}

/**
 * Persists one AI-derived thought with the reserved `derived` dataset and its
 * backlink rows.
 *
 * @todo P1: Cascade-delete backlink rows when the `derived` dataset membership is removed.
 *
 * @todo P2: Optionally accept `agentRunId` for per-thought association; batch runs currently set `resultThoughtIds` via `completeDistillationAgentRun`.
 */
const saveDerivedThought = async (
    input: SaveDerivedThoughtInput
): Promise<Thought> => {
    if (input.backlinks.length === 0)
        throw new Error("Derived thoughts require at least one backlink.")

    const database = getDatabase()
    const derivedDataset = await getOrCreateDerivedDataset()

    return database.transaction(async tx => {
        const [thought] = await tx
            .insert(thoughts)
            .values({
                content: input.content,
                brainId: input.brainId ?? null,
                grade: "derived",
                isAiAuthored: true,
                isSystem: false
            })
            .returning()

        if (!thought) throw new Error("Failed to save derived thought.")

        await tx.insert(thoughtsToDatasets).values({
            thoughtId: thought.id,
            datasetId: derivedDataset.id
        })

        await tx
            .insert(backlinks)
            .values(toBacklinkInsertValues(thought.id, input.backlinks))

        return thought
    })
}

export { type SaveDerivedThoughtInput, saveDerivedThought }
