import type { ComponentType } from "react"
import { ContextProvider } from "./provider.tsx"

function withContext<Props extends object>(Component: ComponentType<Props>) {
    return function WithContext(props: Props) {
        return (
            <ContextProvider>
                <Component {...props} />
            </ContextProvider>
        )
    }
}

export { withContext }
