import { copyFile, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import {
    environment,
    type LaunchProps,
    LaunchType,
    showToast,
    Toast
} from "@raycast/api"
import { createDeeplink, DeeplinkType } from "@raycast/utils"
import {
    createShortcutScriptCommandFilePath,
    ensureShortcutScriptCommandsDirectory,
    quoteAndEscapeShellArgument
} from "../utils"
import { createShortcutScriptCommand } from "./create-script-command"
import {
    SHORTCUT_AUTHOR,
    SHORTCUT_AUTHOR_URL,
    SHORTCUT_ICON_FILE_NAME,
    SHORTCUT_SUBTITLE
} from "./definitions"

type InstallShortcutScriptCommandOptions = {
    id: string
    title: string

    description: string

    target:
        | {
              type: "external"
              url: string
          }
        | {
              type: "command"
              name: string

              launchContext?: LaunchProps["launchContext"]
          }
}

/**
 * @todo P2: Extend to write/read/sync a remote registry to manage shortcut installations from.
 *
 * @todo P2: Add support for deletions/uninstalls.
 */
async function installShortcutScriptCommand({
    id,
    title,

    description,

    target
}: InstallShortcutScriptCommandOptions) {
    try {
        await ensureShortcutScriptCommandsDirectory()

        const scriptCommandPath = createShortcutScriptCommandFilePath({ id })

        let url: string

        switch (target.type) {
            case "external":
                url = target.url

                break

            case "command":
                url = createDeeplink({
                    command: target.name,
                    type: DeeplinkType.Extension,
                    launchType: LaunchType.UserInitiated,

                    fallbackText: undefined,

                    context: target.launchContext
                })

                break

            default:
                throw new Error("This should never happen.")
        }

        const extensionAssetsIconPath = join(
            environment.assetsPath,
            SHORTCUT_ICON_FILE_NAME
        )

        const supportAssetsDirectory = join(environment.supportPath, "assets")

        const supportAssetsIconPath = join(
            supportAssetsDirectory,
            SHORTCUT_ICON_FILE_NAME
        )
        const supportAssetsRelativeIconPath = `../../assets/${SHORTCUT_ICON_FILE_NAME}`

        await mkdir(supportAssetsDirectory, { recursive: true })
        await copyFile(extensionAssetsIconPath, supportAssetsIconPath)

        await writeFile(
            scriptCommandPath,

            createShortcutScriptCommand({
                icon: supportAssetsRelativeIconPath,
                title,
                subtitle: SHORTCUT_SUBTITLE,

                url: quoteAndEscapeShellArgument(url),

                author: SHORTCUT_AUTHOR,
                authorUrl: SHORTCUT_AUTHOR_URL,
                description
            }),

            { mode: 0o755 }
        )

        await showToast({
            style: Toast.Style.Success,
            title: "Shortcut Installed",
            message: `Successfully installed '${title}' shortcut.`
        })
    } catch (error) {
        console.error(
            `Shortcut Installation Failed: Failed to install '${title}' shortcut.`,
            error
        )

        await showToast({
            style: Toast.Style.Failure,
            title: "Shortcut Installation Failed",
            message: `Failed to install '${title}' shortcut. Please try again later.`
        })
    }
}

export { installShortcutScriptCommand }
