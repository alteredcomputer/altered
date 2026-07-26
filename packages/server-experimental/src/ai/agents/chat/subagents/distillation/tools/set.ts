import { createCompleteTool } from "./complete"
import { createExpandContextTool } from "./expand-context"
import type { DistillationToolOptions } from "./options"
import { createQueryThoughtsTool } from "./query-thoughts"
import { createRecordThoughtTool } from "./record-thought"
import { createSearchSourceTool } from "./search-source"
import { createUpdateThoughtTool } from "./update-thought"

const createDistillationToolSet = (options: DistillationToolOptions) => ({
    "query-thoughts": createQueryThoughtsTool(),
    "expand-context": createExpandContextTool(options),
    "search-source": createSearchSourceTool(),
    "record-thought": createRecordThoughtTool(options),
    "update-thought": createUpdateThoughtTool(options),
    complete: createCompleteTool()
})

export { createDistillationToolSet }
