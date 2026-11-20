import type { apiErrorFactoryMap } from "./index.ts"

const apiErrorFactoryStatusMap = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    CLIENT_CLOSED_REQUEST: 499,
    INTERNAL_SERVER_ERROR: 500
} satisfies Record<keyof typeof apiErrorFactoryMap, number>

export { apiErrorFactoryStatusMap }
