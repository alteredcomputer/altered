import { alteredThoughtSchema } from "@altered/shared-experimental/models/thoughts/schemas.ts"
import { List } from "@raycast/api"

const helloThought = alteredThoughtSchema.assert({
    id: "hello",

    alias: "hello",
    content: "Hello, ALTERED.",

    createdAt: new Date(),
    updatedAt: new Date(),

    addedAt: new Date()
})

function HelloCommand() {
    return (
        <List navigationTitle="Hello">
            <List.Item
                accessories={[{ date: helloThought.createdAt }]}
                id={helloThought.id}
                title={helloThought.content}
            />
        </List>
    )
}

export { HelloCommand }
