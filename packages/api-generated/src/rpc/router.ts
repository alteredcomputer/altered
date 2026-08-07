import { ping } from "./procedures/health"
import { create, createMany, list } from "./procedures/thoughts"

const rpcRouter = {
    health: {
        ping
    },
    thoughts: {
        create,
        createMany,
        list
    }
}

type RpcRouter = typeof rpcRouter

export { type RpcRouter, rpcRouter }
