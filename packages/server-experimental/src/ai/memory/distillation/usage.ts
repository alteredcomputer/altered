import {
    formatOpenRouterCost,
    parseOpenrouterProviderMetadata
} from "../../provider/metadata"

type UsageTotals = {
    cost: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
}

const createUsageTotals = (): UsageTotals => ({
    cost: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0
})

const accumulateStepUsage = (
    totals: UsageTotals,
    providerMetadata: Parameters<typeof parseOpenrouterProviderMetadata>[0]
): void => {
    const usage =
        parseOpenrouterProviderMetadata(providerMetadata)?.openrouter?.usage

    totals.cost += usage?.cost ?? 0
    totals.inputTokens += usage?.promptTokens ?? 0
    totals.outputTokens += usage?.completionTokens ?? 0
    totals.totalTokens += usage?.totalTokens ?? 0
}

const formatUsageCost = (totals: UsageTotals): string =>
    formatOpenRouterCost(totals.cost) ?? "$0.0000 USD"

export {
    accumulateStepUsage,
    createUsageTotals,
    formatUsageCost,
    type UsageTotals
}
