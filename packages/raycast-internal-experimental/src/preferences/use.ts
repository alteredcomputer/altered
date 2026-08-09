import { useCachedState } from "@raycast/utils"
import {
    COLLECTION_LAYOUT_DEFAULT,
    type CollectionLayoutID,
    IS_ICON_VISIBLE_DEFAULT,
    PREFERENCES_CACHE_NAMESPACE,
    TINT_COLOR_DEFAULT
} from "./definitions"

/**
 * @remarks Each Raycast navigation stack entry is an isolated instance, so cached
 *   state is used instead of React context for preferences shared across views.
 */
function usePreferences() {
    const [isIconVisible, setIsIconVisible] = useCachedState(
        "is-icon-visible",
        IS_ICON_VISIBLE_DEFAULT,
        { cacheNamespace: PREFERENCES_CACHE_NAMESPACE }
    )

    const [collectionLayout, setCollectionLayout] =
        useCachedState<CollectionLayoutID>(
            "collection-layout",
            COLLECTION_LAYOUT_DEFAULT,
            { cacheNamespace: PREFERENCES_CACHE_NAMESPACE }
        )

    return {
        isIconVisible: {
            value: isIconVisible,
            toggle: () => setIsIconVisible(value => !value)
        },

        tintColor: TINT_COLOR_DEFAULT,

        collectionLayout: {
            value: collectionLayout,
            toggle: () =>
                setCollectionLayout(value =>
                    value === "list" ? "grid" : "list"
                )
        }
    }
}

export { usePreferences }
