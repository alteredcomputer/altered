import { isCancel as _isCancel } from "@clack/prompts"

/**
 * @remarks Wrapper to help narrow the prompt result type towards or away from `symbol`.
 */
function isCancel(value: Parameters<typeof _isCancel>[0]): value is symbol {
    return _isCancel(value)
}

export { isCancel }
