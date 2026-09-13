import { log } from "@clack/prompts"

function refuseAndFinish({ message }: { message: string }): null {
    log.error(message)

    return null
}

export { refuseAndFinish }
