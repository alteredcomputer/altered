import { ActionPanel, Detail } from "@raycast/api"
import { CopyMarkdownToClipboardAction } from "../../../actions/copy-markdown-to-clipboard"
import { GoToPreviousAction } from "../../../actions/go-to-previous"
import { ToggleIconVisibilityAction } from "../../../actions/toggle-icon-visibility"
import { useMicroRenderer } from "../../../micro-renderer/context"
import { QUERY_MEMORY_TOOL_POC_MARKDOWN } from "./definitions"

function QueryMemoryToolPocInterface() {
    const { navigationTitle } = useMicroRenderer()

    return (
        <Detail
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <CopyMarkdownToClipboardAction
                            markdown={QUERY_MEMORY_TOOL_POC_MARKDOWN}
                        />
                    </ActionPanel.Section>

                    <ActionPanel.Section>
                        <GoToPreviousAction />
                        <ToggleIconVisibilityAction />
                    </ActionPanel.Section>
                </ActionPanel>
            }
            markdown={QUERY_MEMORY_TOOL_POC_MARKDOWN}
            navigationTitle={navigationTitle}
        />
    )
}

export { QueryMemoryToolPocInterface }
