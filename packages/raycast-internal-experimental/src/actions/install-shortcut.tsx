import { Action, Icon } from "@raycast/api"
import { ACTION_PALETTE_COMMAND_NAME } from "../commands/action-palette/definitions"
import { usePreferences } from "../preferences/use"
import { installShortcutScriptCommand } from "../shortcuts/installation/implementation"

function InstallShortcutAction({
    actionId,
    title,
    description
}: {
    actionId: string
    title: string
    description: string
}) {
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.Download, tintColor }
                    : undefined
            }
            onAction={() =>
                installShortcutScriptCommand({
                    id: actionId,
                    title,
                    description,
                    target: {
                        type: "command",
                        name: ACTION_PALETTE_COMMAND_NAME,
                        launchContext: { actionId }
                    }
                })
            }
            title="Install Shortcut"
        />
    )
}

export { InstallShortcutAction }
