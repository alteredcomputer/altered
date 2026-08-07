import {
    closeMainWindow,
    PopToRootType,
    popToRoot,
    showToast,
    Toast
} from "@raycast/api"

/**
 * @remarks Raycast 2.0 discards command state on `PopToRootType.Immediate`,
 * which swallows toasts. Suspend pop-to-root, show the toast, then pop manually.
 */
async function dismissWithSuccessToast({
    title,
    message
}: {
    title: string
    message?: string
}): Promise<void> {
    await closeMainWindow({
        popToRootType: PopToRootType.Suspended,
        clearRootSearch: true
    })

    await showToast({
        style: Toast.Style.Success,
        title,
        message
    })

    await popToRoot({ clearSearchBar: true })
}

export { dismissWithSuccessToast }
