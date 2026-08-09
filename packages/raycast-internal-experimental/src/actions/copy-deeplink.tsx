import {
    Action,
    Clipboard,
    Icon,
    LaunchType,
    showToast,
    Toast
} from "@raycast/api"
import { createDeeplink, DeeplinkType } from "@raycast/utils"
import { ACTION_PALETTE_COMMAND_NAME } from "../commands/action-palette/definitions"
import { usePreferences } from "../preferences/use"

function CopyDeeplinkAction({
    actionId,
    title
}: {
    actionId: string
    title: string
}) {
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.Link, tintColor }
                    : undefined
            }
            onAction={async () => {
                const url = createDeeplink({
                    command: ACTION_PALETTE_COMMAND_NAME,
                    type: DeeplinkType.Extension,
                    launchType: LaunchType.UserInitiated,
                    context: { actionId }
                })

                await Clipboard.copy(url)

                await showToast({
                    title: "Deeplink Copied",
                    message: `Successfully copied the deeplink for '${title}' to clipboard.`,
                    style: Toast.Style.Success
                })
            }}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            title="Copy Deeplink"
        />
    )
}

export { CopyDeeplinkAction }
