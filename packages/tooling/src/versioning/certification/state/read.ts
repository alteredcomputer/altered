import { readFileSync } from "node:fs"
import { getCertificationStatePath } from "../utils/get-certification-state-path"
import type { CertificationState } from "./definitions"

/**
 * @remarks Returns `null` whenever there is nothing trustworthy to read, which is the normal case for an uncertified commit - a bypassed branch, or `--no-verify`.
 */
function readCertificationState(): CertificationState | null {
    try {
        const parsedCertificationState = JSON.parse(
            readFileSync(getCertificationStatePath(), "utf8")
        ) as Partial<CertificationState>

        if (
            !parsedCertificationState.reasoning ||
            !parsedCertificationState.signature
        )
            return null

        return {
            reasoning: parsedCertificationState.reasoning,
            signature: parsedCertificationState.signature
        }
    } catch {
        return null
    }
}

export { readCertificationState }
