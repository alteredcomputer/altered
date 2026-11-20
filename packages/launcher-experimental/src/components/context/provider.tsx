import { QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, useState } from "react"
import { createApiQueryClient } from "../../api/query-client/create.ts"

function ContextProvider({ children }: { children: ReactNode }) {
    const [apiQueryClient] = useState(() => createApiQueryClient())

    return (
        <QueryClientProvider client={apiQueryClient}>
            {children}
        </QueryClientProvider>
    )
}

export { ContextProvider }
