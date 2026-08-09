import type { InterfaceDefinition, InterfaceID } from "./definitions"
import { INTERFACE_REGISTRY } from "./registry"

function resolveInterfaceDefinition(
    interfaceId: InterfaceID
): InterfaceDefinition | undefined {
    if (!(interfaceId in INTERFACE_REGISTRY)) return

    return INTERFACE_REGISTRY[interfaceId as keyof typeof INTERFACE_REGISTRY]
}

function resolveNavigationTitle(path: InterfaceID[]) {
    return path
        .map(interfaceId => {
            const definition = resolveInterfaceDefinition(interfaceId)

            return definition?.title ?? interfaceId
        })
        .join(" → ")
}

export { resolveInterfaceDefinition, resolveNavigationTitle }
