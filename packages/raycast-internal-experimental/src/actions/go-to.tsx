import { Action, Icon } from "@raycast/api"
import { useMicroRenderer } from "../micro-renderer/context"
import type { InterfaceID } from "../micro-renderer/definitions"
import { usePreferences } from "../preferences/use"

function GoToAction({ interfaceId }: { interfaceId: InterfaceID }) {
    const { goTo } = useMicroRenderer()
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.ArrowRightCircle, tintColor }
                    : undefined
            }
            onAction={() => goTo(interfaceId)}
            shortcut={{ modifiers: ["cmd"], key: "arrowRight" }}
            title="Go To Action"
        />
    )
}

export { GoToAction }
