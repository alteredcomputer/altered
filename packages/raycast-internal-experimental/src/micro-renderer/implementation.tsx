import { Detail } from "@raycast/api"
import { useMemo, useState } from "react"
import { MicroRendererContext } from "./context"
import type { InterfaceID } from "./definitions"
import {
    resolveInterfaceDefinition,
    resolveNavigationTitle
} from "./resolve-navigation-title"

function MicroRenderer({ initialPath }: { initialPath: InterfaceID[] }) {
    const [path, setPath] = useState<InterfaceID[]>(initialPath)

    const navigationTitle = useMemo(() => resolveNavigationTitle(path), [path])

    const tipId = path.at(-1)

    const tip = tipId ? resolveInterfaceDefinition(tipId) : undefined

    const value = useMemo(
        () => ({
            path,
            navigationTitle,
            goTo: (interfaceId: InterfaceID) => {
                if (!resolveInterfaceDefinition(interfaceId)) return

                setPath(current =>
                    current.at(-1) === interfaceId
                        ? current
                        : [...current, interfaceId]
                )
            },
            goBack: () => {
                setPath(current =>
                    current.length <= 1 ? current : current.slice(0, -1)
                )
            }
        }),
        [path, navigationTitle]
    )

    if (!tip)
        return (
            <Detail
                markdown={`# Unknown Interface\n\nNo interface registered for \`${tipId ?? "undefined"}\`.`}
                navigationTitle={navigationTitle}
            />
        )

    const Interface = tip.component

    return (
        <MicroRendererContext.Provider value={value}>
            <Interface />
        </MicroRendererContext.Provider>
    )
}

export { MicroRenderer }
