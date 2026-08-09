import { createContext, useContext } from "react"
import type { InterfaceID } from "./definitions"

type MicroRendererContextValue = {
    path: InterfaceID[]
    navigationTitle: string
    goTo: (interfaceId: InterfaceID) => void
    goBack: () => void
}

const MicroRendererContext = createContext<MicroRendererContextValue | null>(
    null
)

function useMicroRenderer() {
    const context = useContext(MicroRendererContext)

    if (!context)
        throw new Error("useMicroRenderer must be used within MicroRenderer.")

    return context
}

export type { MicroRendererContextValue }
export { MicroRendererContext, useMicroRenderer }
