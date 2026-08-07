import { base } from "../base"

const ping = base.handler(async () => ({
    status: "ok" as const,
    tier: "generated" as const
}))

export { ping }
