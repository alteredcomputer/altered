import { join } from "node:path"
import { environment } from "@raycast/api"

/**
 * @todo P3: Make configurable based on config or application target.
 */
const SHORTCUT_SUBTITLE = "ALTERED Internal Shortcut"
const SHORTCUT_AUTHOR = "ALTERED"

/**
 * @todo P3: Consider updating to something more relevant.
 */
const SHORTCUT_AUTHOR_URL = "https://usealtered.com"

/**
 * @todo P3: Make configurable based on config or application target.
 */
const SHORTCUT_ICON_FILE_NAME = "raycast-internal-experimental-icon-tmp.png"
const SHORTCUT_ICON_PATH = join(environment.assetsPath, SHORTCUT_ICON_FILE_NAME)

export {
    SHORTCUT_AUTHOR,
    SHORTCUT_AUTHOR_URL,
    SHORTCUT_ICON_FILE_NAME,
    SHORTCUT_ICON_PATH,
    SHORTCUT_SUBTITLE
}
