import { Action, closeMainWindow, Icon, PopToRootType } from "@raycast/api"
import { usePreferences } from "../preferences/use"

/**
 * @todo P2: Re-enable once we pick a non-reserved shortcut (cmd+w is reserved).
 */
function CloseAction() {
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.XMarkCircle, tintColor }
                    : undefined
            }
            onAction={() =>
                closeMainWindow({
                    clearRootSearch: true,
                    popToRootType: PopToRootType.Immediate
                })
            }
            title="Close Action"
        />
    )
}

export { CloseAction }
