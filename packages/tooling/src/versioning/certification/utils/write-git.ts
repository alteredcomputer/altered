import { execFileSync } from "node:child_process"

function writeGit(_arguments: string[]): void {
    execFileSync("git", _arguments, {
        encoding: "utf8",
        stdio: ["ignore", "ignore", "pipe"]
    })
}

export { writeGit }
