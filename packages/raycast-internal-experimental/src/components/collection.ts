import { Grid, List } from "@raycast/api"
import { useMemo } from "react"
import { usePreferences } from "../preferences/use"

const COLLECTION_GRID_COLUMNS = 7

const COLLECTION_GRID_INSET = Grid.Inset.Large

/**
 * @remarks List and Grid share nearly interchangeable root props and nested
 *   `Section` / `Item` constructors, so callers can swap layout via preferences.
 */
function useCollection() {
    const { collectionLayout } = usePreferences()

    return useMemo(
        () => (collectionLayout.value === "list" ? List : Grid),
        [collectionLayout.value]
    )
}

export { COLLECTION_GRID_COLUMNS, COLLECTION_GRID_INSET, useCollection }
