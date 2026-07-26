import type { LanguageModelID } from "@altered/core-experimental/config/ai"
import { generateText, Output } from "ai"
import { type } from "arktype"
import { DEFAULT_WORKER_MODEL_ID } from "../../models/defaults"
import { createOpenrouterChatModel } from "../../provider/create-chat-model"

/**
 * @todo P1: Unstub brain-context pre-search (Plan B query pipeline) before generation.
 *
 * @todo P2: Downgrade/raise models per step once cost vs quality is measured.
 *
 * @todo P2: add a `mode: "index" | "query"` option to skip `strip` for query-side callers.
 */
const DEFAULT_KEYWORD_MODEL_ID: LanguageModelID = DEFAULT_WORKER_MODEL_ID

const keywordsSchema = type({
    keywords: type("string[]").describe(
        "Single-word search keywords about the thought. No phrases."
    )
})

type KeywordPipelineOptions = {
    modelId?: LanguageModelID

    /**
     * Synonym-expansion passes. Default 1 - a second pass drifts.
     */
    expandIterations?: number
}

type KeywordPipelineResult = {
    keywords: string[]
    generated: string[]
    expanded: string[]
    stripped: string[]
}

const normalizeKeyword = (keyword: string): string =>
    keyword.trim().toLowerCase().replace(/\s+/g, " ")

/**
 * Keywords are exactly one word. Multi-word phrases are dropped.
 */
const uniqueKeywords = (keywords: string[]): string[] => {
    const seen = new Set<string>()
    const result: string[] = []

    for (const keyword of keywords) {
        const normalized = normalizeKeyword(keyword)

        if (normalized.length === 0 || normalized.includes(" ")) continue

        if (seen.has(normalized)) continue

        seen.add(normalized)
        result.push(normalized)
    }

    return result
}

const generateKeywordList = async (
    modelId: LanguageModelID,
    system: string,
    prompt: string
): Promise<string[]> => {
    const { output } = await generateText({
        model: createOpenrouterChatModel({ modelId }),
        output: Output.object({ schema: keywordsSchema }),
        system,
        prompt
    })

    if (!output)
        throw new Error("Keyword generation produced no structured output.")

    return uniqueKeywords(output.keywords)
}

const generateKeywords = async (
    thoughtContent: string,
    modelId: LanguageModelID
): Promise<string[]> =>
    generateKeywordList(
        modelId,
        `
You generate search keywords for one thought in a personal knowledge brain.

Rules:

- Keywords describe ONLY the thought text - not imagined surrounding context.
- Each keyword is exactly one word. No phrases. No multi-word compounds with spaces.
- Prefer concrete nouns, verbs, and distinctive terms a human would search later.
- No full sentences. No duplicates. Lowercase is fine.
`.trim(),
        `Thought:\n${thoughtContent}`
    )

const expandKeywords = async (
    thoughtContent: string,
    keywords: string[],
    modelId: LanguageModelID
): Promise<string[]> =>
    generateKeywordList(
        modelId,
        `
You expand an existing keyword list with close single-word synonyms and alternates.

Rules:

- Stay tightly related to the thought and the given keywords.
- Do not invent distant associations (e.g. pets → animals is fine; pets → kibble is not).
- Each keyword is exactly one word. No phrases.
- Return ONLY new keywords - do not repeat the inputs.
`.trim(),
        [
            `Thought:\n${thoughtContent}`,
            "",
            `Existing keywords:\n${keywords.join("\n")}`
        ].join("\n")
    )

/**
 * Drops expanded keywords that are not directly relevant to the thought.
 * Directly generated keywords are always kept.
 */
const stripExpandedKeywords = async (
    thoughtContent: string,
    generated: string[],
    expanded: string[],
    modelId: LanguageModelID
): Promise<string[]> => {
    if (expanded.length === 0) return []

    const kept = await generateKeywordList(
        modelId,
        `
You filter synonym-expanded keywords for a thought.

Rules:

- Return ONLY the expanded keywords that remain directly relevant to the thought.
- Drop drifted associations.
- Do not add new keywords.
- Each keyword is exactly one word.
- Do not return the original generated keywords - only keepers from the expanded list.
`.trim(),
        [
            `Thought:\n${thoughtContent}`,
            "",
            `Original keywords (already kept):\n${generated.join("\n")}`,
            "",
            `Expanded candidates to filter:\n${expanded.join("\n")}`
        ].join("\n")
    )

    const allowed = new Set(expanded)

    return kept.filter(keyword => allowed.has(keyword))
}

/**
 * Shared indexing/query keyword path: generate → expand → relevance-strip.
 *
 * @remarks Query-side callers should skip `strip` (associative reach). Use
 * `generateKeywords` + `expandKeywords` directly, or pass `expandIterations`
 * and ignore `stripped` until an explicit `mode` option lands.
 */
const runKeywordPipeline = async (
    thoughtContent: string,
    options: KeywordPipelineOptions = {}
): Promise<KeywordPipelineResult> => {
    const modelId = options.modelId ?? DEFAULT_KEYWORD_MODEL_ID
    const expandIterations = options.expandIterations ?? 1

    const generated = await generateKeywords(thoughtContent, modelId)

    let expanded: string[] = []
    let pool = generated

    for (let iteration = 0; iteration < expandIterations; iteration += 1) {
        const next = await expandKeywords(thoughtContent, pool, modelId)
        const novel = next.filter(keyword => !pool.includes(keyword))

        expanded = uniqueKeywords([...expanded, ...novel])
        pool = uniqueKeywords([...pool, ...novel])
    }

    const stripped = await stripExpandedKeywords(
        thoughtContent,
        generated,
        expanded,
        modelId
    )

    return {
        generated,
        expanded,
        stripped,
        keywords: uniqueKeywords([...generated, ...stripped])
    }
}

export {
    DEFAULT_KEYWORD_MODEL_ID,
    expandKeywords,
    generateKeywords,
    type KeywordPipelineOptions,
    type KeywordPipelineResult,
    runKeywordPipeline,
    stripExpandedKeywords,
    uniqueKeywords
}
