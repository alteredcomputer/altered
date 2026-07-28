import { type LaunchProps, List } from "@raycast/api"

function ActionPaletteCommand(props: LaunchProps) {
    const _launchContext = resolveLaunchContext(props.launchContext, {
        schema: { actionId: "string" }
    })

    return (
        <List>
            <List.Item title="Hello, world!" />
        </List>
    )
}

export { ActionPaletteCommand }
