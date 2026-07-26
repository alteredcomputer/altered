import type {
    CollectedThought,
    DistillationSource
} from "../../agents/chat/subagents/distillation/context"
import type { createDistillationAgent } from "../../agents/chat/subagents/distillation/definition"
import { accumulateStepUsage, type UsageTotals } from "./usage"

type DistillationAgent = ReturnType<typeof createDistillationAgent>

type RunDistillationChunksOptions = {
    agent: DistillationAgent
    source: DistillationSource
    loadedSources: DistillationSource[]
    collectedThoughts: CollectedThought[]
    maxChunks?: number
    log?: boolean
    totals: UsageTotals
}

type RunDistillationChunksResult = {
    chunkLogs: unknown[]
    stepCount: number
}

const runDistillationChunks = async (
    options: RunDistillationChunksOptions
): Promise<RunDistillationChunksResult> => {
    const {
        agent,
        source,
        loadedSources,
        collectedThoughts,
        totals,
        log: shouldLog = false
    } = options

    const processedChunks = Math.min(
        options.maxChunks ?? source.chunks.length,
        source.chunks.length
    )

    const chunkLogs: unknown[] = []
    let stepCount = 0

    for (const chunk of source.chunks.slice(0, processedChunks)) {
        if (shouldLog)
            console.log(
                `\n[chunk ${chunk.index}] ${JSON.stringify(chunk.text)}`
            )

        const thoughtCountBefore = collectedThoughts.length

        const result = await agent.generate({
            options: {
                context: {
                    sources: loadedSources,
                    chunkIndex: chunk.index,
                    collectedThoughts
                }
            },

            messages: [
                {
                    role: "system",
                    content: [
                        "Distillation target:",
                        "- Source type: Koa iMessage chat message",
                        `- Source 0 author: ${source.author}`,
                        `- Chunk ${chunk.index + 1} of ${source.chunks.length} (index ${chunk.index}, kind: ${chunk.kind})`,
                        `- Chunk spans characters ${chunk.start}-${chunk.end} of source 0`,
                        "The next user message is the exact chunk text, verbatim (it may include leading whitespace)."
                    ].join("\n")
                },
                { role: "user", content: chunk.text }
            ]
        })

        stepCount += result.steps.length

        for (const step of result.steps)
            accumulateStepUsage(totals, step.providerMetadata)

        chunkLogs.push({
            index: chunk.index,
            kind: chunk.kind,
            start: chunk.start,
            end: chunk.end,
            text: chunk.text,
            stepCount: result.steps.length,
            recordedThoughtCount: collectedThoughts.length - thoughtCountBefore
        })
    }

    return { chunkLogs, stepCount }
}

export { runDistillationChunks }
