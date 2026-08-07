import { Detail, showToast, Toast } from "@raycast/api"
import { usePromise } from "@raycast/utils"
import { client } from "../../api/rpc-client"

function PingApiCommand() {
    const { isLoading, data, error } = usePromise(async () => {
        const result = await client.health.ping()

        await showToast({
            style: Toast.Style.Success,
            title: "API reachable",
            message: result.tier
        })

        return result
    })

    if (error)
        return (
            <Detail
                markdown={`# Ping failed\n\n\`\`\`\n${error.message}\n\`\`\``}
            />
        )

    return (
        <Detail
            isLoading={isLoading}
            markdown={
                data
                    ? `# ${data.status}\n\nTier: \`${data.tier}\``
                    : "# Pinging generated API…"
            }
        />
    )
}

export { PingApiCommand }
