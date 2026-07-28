import { type LaunchProps, List } from "@raycast/api"

function ActionPaletteCommand(_props: LaunchProps) {
    return (
        <List>
            <List.Item title="Hello, world!" />
        </List>
    )
}

export { ActionPaletteCommand }
