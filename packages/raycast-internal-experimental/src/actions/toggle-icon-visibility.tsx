import { Action, Icon } from "@raycast/api"
import { usePreferences } from "../preferences/use"

function ToggleIconVisibilityAction() {
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.EyeDisabled, tintColor }
                    : undefined
            }
            onAction={isIconVisible.toggle}
            shortcut={{
                modifiers: ["cmd", "shift"],
                key: "i"
            }}
            title={isIconVisible.value ? "Hide Icons" : "Show Icons"}
        />
    )
}

export { ToggleIconVisibilityAction }
