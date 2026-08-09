import { Action, closeMainWindow, Icon, PopToRootType } from "@raycast/api"
import { useMicroRenderer } from "../micro-renderer/context"
import { usePreferences } from "../preferences/use"

function GoToPreviousAction() {
    const { path, goBack } = useMicroRenderer()
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.ArrowLeftCircle, tintColor }
                    : undefined
            }
            onAction={() => {
                if (path.length <= 1) {
                    void closeMainWindow({
                        clearRootSearch: true,
                        popToRootType: PopToRootType.Immediate
                    })

                    return
                }

                goBack()
            }}
            shortcut={{ modifiers: ["cmd"], key: "arrowLeft" }}
            title="Go To Previous Action"
        />
    )
}

export { GoToPreviousAction }
