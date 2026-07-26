import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

type WriteAgentRunLogOptions = {
    agentId: string
    startedAt: Date
    data: unknown
}

/**
 * Persists one agent run to `.logs/agents/<agentId>/runs/` and returns the path.
 *
 * @todo P2: Replace with the `agent_runs` table once the distillation schema lands - files stay as the raw trace.
 */
const writeAgentRunLog = async ({
    agentId,
    startedAt,
    data
}: WriteAgentRunLogOptions): Promise<string> => {
    const directory = join(process.cwd(), ".logs", "agents", agentId, "runs")
    const fileName = `${startedAt.toISOString().replace(/[:.]/g, "-")}.json`
    const path = join(directory, fileName)

    await mkdir(directory, { recursive: true })
    await writeFile(path, `${JSON.stringify(data, null, 4)}\n`)

    return path
}

export { type WriteAgentRunLogOptions, writeAgentRunLog }
