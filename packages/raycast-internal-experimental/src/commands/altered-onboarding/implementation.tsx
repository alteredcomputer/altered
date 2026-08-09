import { ActionPanel, Detail } from "@raycast/api"
import { CopyMarkdownToClipboardAction } from "../../actions/copy-markdown-to-clipboard"
import { GoToPreviousAction } from "../../actions/go-to-previous"
import { ToggleIconVisibilityAction } from "../../actions/toggle-icon-visibility"
import { useMicroRenderer } from "../../micro-renderer/context"
import { ALTERED_ONBOARDING_MARKDOWN } from "./definitions"

function AlteredOnboardingInterface() {
    const { navigationTitle } = useMicroRenderer()

    return (
        <Detail
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <CopyMarkdownToClipboardAction
                            markdown={ALTERED_ONBOARDING_MARKDOWN}
                        />
                    </ActionPanel.Section>

                    <ActionPanel.Section>
                        <GoToPreviousAction />
                        <ToggleIconVisibilityAction />
                    </ActionPanel.Section>
                </ActionPanel>
            }
            markdown={ALTERED_ONBOARDING_MARKDOWN}
            navigationTitle={navigationTitle}
        />
    )
}

export { AlteredOnboardingInterface }
