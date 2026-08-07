import { List } from "@raycast/api"
import { useQuery } from "@tanstack/react-query"
import { ApiProvider } from "../../api/provider"
import { api } from "../../api/react"

function ViewThoughtsList() {
    const { isLoading, data, error } = useQuery(
        api.thoughts.list.queryOptions({ input: { limit: 50 } })
    )

    return (
        <List isLoading={isLoading}>
            {error ? (
                <List.EmptyView
                    description={error.message}
                    title="Failed to load thoughts"
                />
            ) : null}

            {!error && (data?.length ?? 0) === 0 ? (
                <List.EmptyView
                    description="Capture a thought to get started."
                    title="No thoughts yet"
                />
            ) : null}

            {data?.map(thought => (
                <List.Item
                    accessories={[
                        {
                            date: new Date(thought.createdAt)
                        }
                    ]}
                    id={thought.id}
                    key={thought.id}
                    title={thought.content}
                />
            ))}
        </List>
    )
}

function ViewThoughtsCommand() {
    return (
        <ApiProvider>
            <ViewThoughtsList />
        </ApiProvider>
    )
}

export { ViewThoughtsCommand }
