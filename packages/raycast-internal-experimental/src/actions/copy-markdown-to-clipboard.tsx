import { Action, Clipboard, Icon, showToast, Toast } from "@raycast/api"
import { usePreferences } from "../preferences/use"

function CopyMarkdownToClipboardAction({ markdown }: { markdown: string }) {
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? { source: Icon.Clipboard, tintColor }
                    : undefined
            }
            onAction={async () => {
                await Clipboard.copy(markdown)

                await showToast({
                    style: Toast.Style.Success,
                    title: "Copied to Clipboard"
                })
            }}
            title="Copy to Clipboard"
        />
    )
}

export { CopyMarkdownToClipboardAction }
