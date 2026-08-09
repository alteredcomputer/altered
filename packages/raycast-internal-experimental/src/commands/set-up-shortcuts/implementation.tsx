import { ActionPanel, Detail } from "@raycast/api"
import { useState } from "react"
import { GoToPreviousAction } from "../../actions/go-to-previous"
import { ToggleIconVisibilityAction } from "../../actions/toggle-icon-visibility"
import { UninstallAllShortcutsAction } from "../../actions/uninstall-all-shortcuts"
import { useMicroRenderer } from "../../micro-renderer/context"
import { SET_UP_SHORTCUTS_MARKDOWN } from "../../shortcuts/setup/definitions"
import {
    CopyDirectoryAndOpenSettingsAction,
    DismissSetUpShortcutsAction
} from "../../shortcuts/setup/interface/actions"

function SetUpShortcutsInterface() {
    const { navigationTitle } = useMicroRenderer()
    const [hasOpenedSettings, setHasOpenedSettings] = useState(false)

    return (
        <Detail
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        {hasOpenedSettings ? (
                            <>
                                <DismissSetUpShortcutsAction />
                                <CopyDirectoryAndOpenSettingsAction />
                            </>
                        ) : (
                            <>
                                <CopyDirectoryAndOpenSettingsAction
                                    setHasOpenedSettings={setHasOpenedSettings}
                                />
                                <DismissSetUpShortcutsAction />
                            </>
                        )}

                        <UninstallAllShortcutsAction />
                    </ActionPanel.Section>

                    <ActionPanel.Section>
                        <GoToPreviousAction />
                        <ToggleIconVisibilityAction />
                    </ActionPanel.Section>
                </ActionPanel>
            }
            markdown={SET_UP_SHORTCUTS_MARKDOWN}
            navigationTitle={navigationTitle}
        />
    )
}

export { SetUpShortcutsInterface }
