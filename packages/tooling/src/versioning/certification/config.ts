type CertificationConfig = {
    allowedSigners: readonly string[]
    bypassBranchNamePrefixes: readonly string[]
    minimumReasonLength: number
    temporaryStateFileName: string
}

const certificationConfig: CertificationConfig = {
    allowedSigners: ["RILEY BARABASH"],
    bypassBranchNamePrefixes: ["stash/", "archive/"],
    minimumReasonLength: 32,
    temporaryStateFileName: "tmp-certification-state.json"
}

export { type CertificationConfig, certificationConfig }
