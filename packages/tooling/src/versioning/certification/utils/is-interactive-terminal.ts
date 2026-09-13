/**
 * @remarks Both ends are required. Without a terminal on input, answers can be fabricated by piping `stdin`. Without one on output, the questions render somewhere unreadable, which is worse than refusing.
 */
function isInteractiveTerminal(): boolean {
    return process.stdin.isTTY && process.stdout.isTTY
}

export { isInteractiveTerminal }
