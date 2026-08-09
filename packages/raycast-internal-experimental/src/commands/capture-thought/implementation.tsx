import {
    Action,
    ActionPanel,
    closeMainWindow,
    Form,
    PopToRootType,
    showToast,
    Toast
} from "@raycast/api"
import { GoToPreviousAction } from "../../actions/go-to-previous"
import { ToggleIconVisibilityAction } from "../../actions/toggle-icon-visibility"
import { useMicroRenderer } from "../../micro-renderer/context"

function CaptureThoughtInterface() {
    const { navigationTitle } = useMicroRenderer()

    return (
        <Form
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <Action.SubmitForm
                            onSubmit={async (values: { content: string }) => {
                                console.log("[Capture Thought]", values.content)

                                await closeMainWindow({
                                    popToRootType: PopToRootType.Immediate,
                                    clearRootSearch: true
                                })

                                await showToast({
                                    style: Toast.Style.Success,
                                    title: "Thought Captured",
                                    message: "Your thought was captured."
                                })
                            }}
                            title="Capture"
                        />
                    </ActionPanel.Section>

                    <ActionPanel.Section>
                        <GoToPreviousAction />
                        <ToggleIconVisibilityAction />
                    </ActionPanel.Section>
                </ActionPanel>
            }
            navigationTitle={navigationTitle}
        >
            <Form.TextArea
                id="content"
                placeholder="Type a thought..."
                title="Content"
            />
        </Form>
    )
}

export { CaptureThoughtInterface }
