import { log } from "@clack/prompts"

function refuseAndExit({ message }: { message: string }): null {
    log.error(message)

    return null
}

export { refuseAndExit }
