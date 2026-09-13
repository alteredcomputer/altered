import { rmSync } from "node:fs"
import { getCertificationStatePath } from "../utils/get-certification-state-path"

function clearCertificationState(): void {
    rmSync(getCertificationStatePath(), { force: true })
}

export { clearCertificationState }
