type CertificationConfig = {
    allowedSigners: readonly string[]
    bypassBranchNamePrefixes: readonly string[]
    minimumReasonLength: number
}

const certificationConfig: CertificationConfig = {
    allowedSigners: ["RILEY BARABASH"],
    bypassBranchNamePrefixes: ["stash/", "archive/"],
    minimumReasonLength: 32
}

export { type CertificationConfig, certificationConfig }
