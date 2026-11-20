import { apiQueryUtils } from "@altered/client-experimental/api/query/utils.ts"
import { alteredThoughtSchema } from "@altered/shared-experimental/models/thoughts/schemas.ts"
import { Action, ActionPanel, Icon, List } from "@raycast/api"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import { withContext } from "../../components/context/with.tsx"

const helloThought = alteredThoughtSchema.assert({
    id: "hello",

    alias: "hello",
    content: "Hello, ALTERED.",

    createdAt: new Date(),
    updatedAt: new Date(),

    addedAt: new Date()
})

function Hello() {
    const [queryStartedAt, setQueryStartedAt] = useState(() => Date.now())

    const {
        data,
        error,

        isLoading,

        dataUpdatedAt: echoReceivedAt,

        refetch
    } = useQuery(
        apiQueryUtils.system.echo.queryOptions({
            input: {
                message: helloThought.content
            }
        })
    )

    const handleRefresh = useCallback(() => {
        setQueryStartedAt(Date.now())

        refetch()
    }, [refetch])

    const echoLoadDurationMs = useMemo(
        () => echoReceivedAt - queryStartedAt,

        [echoReceivedAt, queryStartedAt]
    )

    const actions = useMemo(
        () => (
            <ActionPanel>
                <Action
                    onAction={handleRefresh}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                    title="Refresh"
                />
            </ActionPanel>
        ),
        [handleRefresh]
    )

    return (
        <List isLoading={isLoading} navigationTitle="Hello">
            <List.Item
                accessories={[{ date: helloThought.createdAt }]}
                actions={actions}
                id={helloThought.id}
                title={helloThought.content}
            />

            {data ? (
                <List.Item
                    accessories={[
                        {
                            text: `${echoLoadDurationMs} ms`,
                            tooltip:
                                "From start of query to receiving the echo."
                        },

                        { date: data.processedAt, tooltip: "Processed at" }
                    ]}
                    actions={actions}
                    id="echo"
                    subtitle="Echoed by the API"
                    title={data.message}
                />
            ) : null}

            {error ? (
                <List.Item
                    actions={actions}
                    icon={Icon.Warning}
                    id="echo-error"
                    subtitle={error.message}
                    title="Echo failed"
                />
            ) : null}
        </List>
    )
}

const HelloCommand = withContext(Hello)

export { HelloCommand }
