import { eq } from "drizzle-orm"
import { getDatabase } from "../../storage/database/connection"
import { type Dataset, datasets } from "./storage/schema"

/**
 * Reserved system dataset alias. Membership is the derived-thought source-link
 * contract - removing it must drop the thought's backlink attributes.
 */
const DERIVED_DATASET_ALIAS = "derived" as const

/**
 * Stable id so concurrent get-or-create cannot duplicate the system row
 * (Postgres unique indexes treat NULL `brainId` as distinct).
 */
const DERIVED_DATASET_ID = "derived" as const

/**
 * @todo P1: When auth / multi-brain lands, decide whether `derived` is global or per-brain.
 */
const getOrCreateDerivedDataset = async (): Promise<Dataset> => {
    const database = getDatabase()

    const [existing] = await database
        .select()
        .from(datasets)
        .where(eq(datasets.id, DERIVED_DATASET_ID))
        .limit(1)

    if (existing) return existing

    const [created] = await database
        .insert(datasets)
        .values({
            id: DERIVED_DATASET_ID,
            alias: DERIVED_DATASET_ALIAS,
            content:
                "System dataset for AI-derived thoughts linked to a source.",
            isSystem: true,
            brainId: null
        })
        .returning()

    if (!created) throw new Error("Failed to create the derived dataset.")

    return created
}

export { DERIVED_DATASET_ALIAS, DERIVED_DATASET_ID, getOrCreateDerivedDataset }
