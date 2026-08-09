import { type LaunchProps, showToast, Toast } from "@raycast/api"
import { useEffect } from "react"
import { MicroRenderer } from "../../micro-renderer/implementation"
import { INTERFACE_REGISTRY } from "../../micro-renderer/registry"
import { resolveLaunchContext } from "../../utils/resolve-launch-context"
import { ACTION_PALETTE_INTERFACE_ID } from "./definitions"

function ActionPaletteCommand(props: LaunchProps) {
    const launchContext = resolveLaunchContext(props.launchContext, {
        schema: { actionId: "string" }
    })

    const actionId = launchContext?.actionId
    const hasKnownAction = Boolean(actionId && actionId in INTERFACE_REGISTRY)

    useEffect(() => {
        if (!actionId || hasKnownAction) return

        void showToast({
            style: Toast.Style.Failure,
            title: "Unknown Action",
            message: `No interface found for '${actionId}'.`
        })
    }, [actionId, hasKnownAction])

    const initialPath = hasKnownAction
        ? [ACTION_PALETTE_INTERFACE_ID, actionId as string]
        : [ACTION_PALETTE_INTERFACE_ID]

    return <MicroRenderer initialPath={initialPath} />
}

export { ActionPaletteCommand }
