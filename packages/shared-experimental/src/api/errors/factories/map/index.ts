import type { ErrorMapItem } from "@orpc/contract"
import { apiErrorFactories } from "../index.ts"

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

const apiErrorFactoryMap = createOrpcErrorFactoryMap(...apiErrorFactories)

export { apiErrorFactoryMap }
