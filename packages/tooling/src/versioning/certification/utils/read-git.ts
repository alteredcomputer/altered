import { execFileSync } from "node:child_process"

function readGit(_arguments: string[]): string {
    return execFileSync("git", _arguments, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
    }).trim()
}

export { readGit }
