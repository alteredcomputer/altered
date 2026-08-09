import type { JSX } from "react"

type InterfaceID = string

type InterfaceDefinition = {
    id: InterfaceID
    title: string
    component: () => JSX.Element
}

export type { InterfaceDefinition, InterfaceID }
