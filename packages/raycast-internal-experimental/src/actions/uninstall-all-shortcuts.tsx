import {
    Action,
    Alert,
    confirmAlert,
    Icon,
    showToast,
    Toast
} from "@raycast/api"
import { useMicroRenderer } from "../micro-renderer/context"
import { usePreferences } from "../preferences/use"
import { uninstallAllShortcutScriptCommands } from "../shortcuts/installation/uninstall-all"

function UninstallAllShortcutsAction() {
    const { goBack } = useMicroRenderer()
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.Trash, tintColor }
                    : undefined
            }
            onAction={async () => {
                const confirmed = await confirmAlert({
                    title: "Uninstall All Shortcuts",
                    message:
                        "This will permanently delete all ALTERED Script Commands in the shortcuts directory.",
                    primaryAction: {
                        title: "Uninstall",
                        style: Alert.ActionStyle.Destructive
                    }
                })

                if (!confirmed) return

                try {
                    const removedCount =
                        await uninstallAllShortcutScriptCommands()

                    await showToast({
                        style: Toast.Style.Success,
                        title: "Shortcuts Uninstalled",
                        message:
                            removedCount === 0
                                ? "No shortcuts were installed."
                                : `Removed ${removedCount} shortcut${removedCount === 1 ? "" : "s"}.`
                    })

                    goBack()
                } catch (error) {
                    console.error("Failed to uninstall shortcuts.", error)

                    await showToast({
                        style: Toast.Style.Failure,
                        title: "Uninstall Failed",
                        message:
                            "Failed to uninstall shortcuts. Please try again."
                    })
                }
            }}
            style={Action.Style.Destructive}
            title="Uninstall All Shortcuts"
        />
    )
}

export { UninstallAllShortcutsAction }
