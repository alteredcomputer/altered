import { QueryClient } from "@tanstack/react-query"

function createApiQueryClient() {
    return new QueryClient()
}

export { createApiQueryClient }
