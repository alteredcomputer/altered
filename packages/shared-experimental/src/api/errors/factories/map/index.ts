import type { ErrorMapItem } from "@orpc/contract"
// biome-ignore lint/performance/noNamespaceImport: Aggregates exports for self-mapping.
import * as apiErrorFactoriesModule from "../definitions.ts"

function createOrpcErrorFactoryMap<
    const ErrorFactory extends ErrorMapItem & { code: string },
    const ErrorFactoryMap = {
        [Factory in ErrorFactory as Factory["code"]]: Factory
    }
>(...errorFactories: ErrorFactory[]): ErrorFactoryMap {
    const errorFactoryMapEntries = errorFactories.map(errorFactory => [
        errorFactory.code,
        errorFactory
    ])

    return Object.fromEntries(errorFactoryMapEntries) as ErrorFactoryMap
}

const apiErrorFactories = [...Object.values(apiErrorFactoriesModule)]

const apiErrorFactoryMap = createOrpcErrorFactoryMap(...apiErrorFactories)

export { apiErrorFactoryMap }
