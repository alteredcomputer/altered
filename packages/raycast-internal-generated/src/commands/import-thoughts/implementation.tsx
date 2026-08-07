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
import {
    expandFilesystemPaths,
    getFileExtension,
    isSupportedFileExtension,
    readTextFile
} from "./file-utils"

function ImportThoughtsForm() {
    const queryClient = useQueryClient()

    const createMany = useMutation(
        api.thoughts.createMany.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: api.thoughts.key()
                })
            }
        })
    )

    const { handleSubmit, itemProps } = useForm<{ importSources: string[] }>({
        onSubmit: async values => {
            try {
                const paths = await expandFilesystemPaths(values.importSources)

                const supported = paths.filter(path =>
                    isSupportedFileExtension(getFileExtension(path))
                )

                if (supported.length === 0) {
                    await showToast({
                        style: Toast.Style.Failure,
                        title: "No supported files",
                        message: "Use .txt, .md, .markdown, or .mdc."
                    })

                    return
                }

                const contents: string[] = []

                for (const path of supported) {
                    const content = (await readTextFile(path)).trim()

                    if (content.length > 0) contents.push(content)
                }

                if (contents.length === 0) {
                    await showToast({
                        style: Toast.Style.Failure,
                        title: "Nothing to import",
                        message: "All selected files were empty."
                    })

                    return
                }

                await createMany.mutateAsync({ contents })

                await closeMainWindow({
                    popToRootType: PopToRootType.Immediate,
                    clearRootSearch: true
                })

                await showToast({
                    style: Toast.Style.Success,
                    title: "Thoughts imported",
                    message: `${contents.length} file(s)`
                })
            } catch (error) {
                await showToast({
                    style: Toast.Style.Failure,
                    title: "Import failed",
                    message:
                        error instanceof Error ? error.message : "Unknown error"
                })
            }
        },
        validation: {
            importSources: FormValidation.Required
        }
    })

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm onSubmit={handleSubmit} title="Import" />
                </ActionPanel>
            }
            isLoading={createMany.isPending}
        >
            <Form.FilePicker
                {...itemProps.importSources}
                allowMultipleSelection
                canChooseDirectories
                canChooseFiles
                title="Sources"
            />
        </Form>
    )
}

function ImportThoughtsCommand() {
    return (
        <ApiProvider>
            <ImportThoughtsForm />
        </ApiProvider>
    )
}

export { ImportThoughtsCommand }
