import {
    Action,
    ActionPanel,
    closeMainWindow,
    Form,
    PopToRootType,
    showToast,
    Toast
} from "@raycast/api"
import { FormValidation, useForm } from "@raycast/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiProvider } from "../../api/provider"
import { api } from "../../api/react"

function CaptureThoughtForm() {
    const queryClient = useQueryClient()

    const createThought = useMutation(
        api.thoughts.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: api.thoughts.key()
                })
            }
        })
    )

    const { handleSubmit, itemProps } = useForm<{ content: string }>({
        onSubmit: async values => {
            try {
                await createThought.mutateAsync({ content: values.content })

                await closeMainWindow({
                    popToRootType: PopToRootType.Immediate,
                    clearRootSearch: true
                })

                await showToast({
                    style: Toast.Style.Success,
                    title: "Thought captured"
                })
            } catch (error) {
                await showToast({
                    style: Toast.Style.Failure,
                    title: "Capture failed",
                    message:
                        error instanceof Error ? error.message : "Unknown error"
                })
            }
        },
        validation: {
            content: FormValidation.Required
        }
    })

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm
                        onSubmit={handleSubmit}
                        title="Capture"
                    />
                </ActionPanel>
            }
            isLoading={createThought.isPending}
        >
            <Form.TextArea
                {...itemProps.content}
                placeholder="Type a raw thought…"
                title="Content"
            />
        </Form>
    )
}

function CaptureThoughtCommand() {
    return (
        <ApiProvider>
            <CaptureThoughtForm />
        </ApiProvider>
    )
}

export { CaptureThoughtCommand }
