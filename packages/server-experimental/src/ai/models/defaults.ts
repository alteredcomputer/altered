import type { LanguageModelID } from "@altered/core-experimental/config/ai"

/**
 * Default for non-chat agents and mechanical AI jobs.
 *
 * @remarks Chat stays on a high-intelligence model. Use this unless the task
 * explicitly needs stronger reasoning.
 */
const DEFAULT_WORKER_MODEL_ID: LanguageModelID = "deepseek/deepseek-v4-flash"

export { DEFAULT_WORKER_MODEL_ID }
