import { Color } from "@raycast/api"

const PREFERENCES_CACHE_NAMESPACE = "*"

const IS_ICON_VISIBLE_DEFAULT = false

const TINT_COLOR_DEFAULT = Color.SecondaryText

const COLLECTION_LAYOUT_DEFAULT = "list" as const

type CollectionLayoutID = "list" | "grid"

export {
    COLLECTION_LAYOUT_DEFAULT,
    type CollectionLayoutID,
    IS_ICON_VISIBLE_DEFAULT,
    PREFERENCES_CACHE_NAMESPACE,
    TINT_COLOR_DEFAULT
}
