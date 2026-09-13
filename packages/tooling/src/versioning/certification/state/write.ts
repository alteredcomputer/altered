import { writeFileSync } from "node:fs"
import { getCertificationStatePath } from "../utils/get-certification-state-path"
import type { CertificationState } from "./definitions"

function writeCertificationState(state: CertificationState): void {
    writeFileSync(getCertificationStatePath(), JSON.stringify(state), "utf8")
}

export { writeCertificationState }
