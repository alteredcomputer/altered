import { Action, Icon, showToast, Toast } from "@raycast/api"
import { usePreferences } from "../preferences/use"

function OpenInBrowserAction() {
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.Globe, tintColor }
                    : undefined
            }
            onAction={() =>
                showToast({
                    style: Toast.Style.Failure,
                    title: "Not Yet Implemented",
                    message: "Opening in browser is not available yet."
                })
            }
            title="Open in Browser"
        />
    )
}

export { OpenInBrowserAction }
