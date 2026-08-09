import { readdir, unlink } from "node:fs/promises"
import { join } from "node:path"
import { SHORTCUT_SCRIPT_COMMANDS_DIRECTORY } from "../definitions"
import { ensureShortcutScriptCommandsDirectory } from "../utils"

async function uninstallAllShortcutScriptCommands() {
    await ensureShortcutScriptCommandsDirectory()

    const entries = await readdir(SHORTCUT_SCRIPT_COMMANDS_DIRECTORY)

    const scriptCommandNames = entries.filter(entry => entry.endsWith(".sh"))

    await Promise.all(
        scriptCommandNames.map(fileName =>
            unlink(join(SHORTCUT_SCRIPT_COMMANDS_DIRECTORY, fileName))
        )
    )

    return scriptCommandNames.length
}

export { uninstallAllShortcutScriptCommands }
