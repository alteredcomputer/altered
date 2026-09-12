import { confirm, intro, note, outro, select, text } from "@clack/prompts"
import { certificationConfig } from "../certification/config"
import {
    CERTIFICATION_CANCELLED_PROMPT_MESSAGE,
    CERTIFICATION_INTRO_MESSAGE,
    CERTIFICATION_OUTRO_MESSAGE,
    CERTIFICATION_REASONING_STEP_PROMPT,
    CERTIFICATION_SELECT_STEPS,
    CERTIFICATION_SIGNATURE_STEP_PROMPT,
    CERTIFICATION_SIGNATURE_STEP_REFUSAL_MESSAGE,
    CERTIFICATION_SOURCE_OF_TRUTH_STEP_PROMPT,
    CERTIFICATION_SOURCE_OF_TRUTH_STEP_REFUSAL_MESSAGE,
    createCertificationReasoningStepValidationErrorMessage,
    createCertificationStagedPathsNoteTitle
} from "../certification/copy"
import { isCancel } from "../certification/utils/clack/is-cancel"
import { refuseAndExit } from "../certification/utils/clack/refuse-and-exit"
import type { GitInformation } from "../certification/utils/get-git-info"

type CommitCertificationOptions = {
    git: GitInformation
}

type CommitCertificationResult = {
    reasoning: string

    signature: string
}

async function runCommitCertification({
    git
}: CommitCertificationOptions): Promise<CommitCertificationResult | null> {
    const { minimumReasonLength, allowedSigners } = certificationConfig

    intro(CERTIFICATION_INTRO_MESSAGE)

    /**
     * @todo P3: Fix wrapping of overflowing staged paths using the `format` parameter of the `note` prompt.
     */
    const stagedPathsNoteContent = git.stagedPaths.join("\n")

    note(
        stagedPathsNoteContent,
        createCertificationStagedPathsNoteTitle(git.branch)
    )

    for (const selectStep of CERTIFICATION_SELECT_STEPS) {
        const selectStepResult = await select({
            message: selectStep.prompt,

            options: selectStep.options.map((answer, index) => ({
                value: index,

                label: answer.text
            })),

            initialValue: 0
        })

        if (isCancel(selectStepResult))
            return refuseAndExit({
                message: CERTIFICATION_CANCELLED_PROMPT_MESSAGE
            })

        const selectedOption = selectStep.options[selectStepResult]

        if (selectedOption?.shouldBlock)
            return refuseAndExit({ message: selectedOption.refusalMessage })
    }

    const reasoningStepResult = await text({
        message: CERTIFICATION_REASONING_STEP_PROMPT,

        validate: value => {
            const lengthErrorMessage =
                createCertificationReasoningStepValidationErrorMessage(
                    minimumReasonLength
                )

            if (!value) return lengthErrorMessage

            const length = value.trim().length
            if (length < minimumReasonLength) return lengthErrorMessage

            return
        }
    })

    if (isCancel(reasoningStepResult))
        return refuseAndExit({
            message: CERTIFICATION_CANCELLED_PROMPT_MESSAGE
        })

    const sourceOfTruthStepResult = await confirm({
        message: CERTIFICATION_SOURCE_OF_TRUTH_STEP_PROMPT,
        initialValue: false
    })

    if (isCancel(sourceOfTruthStepResult))
        return refuseAndExit({
            message: CERTIFICATION_CANCELLED_PROMPT_MESSAGE
        })

    if (!sourceOfTruthStepResult)
        return refuseAndExit({
            message: CERTIFICATION_SOURCE_OF_TRUTH_STEP_REFUSAL_MESSAGE
        })

    const signatureStepResult = await text({
        message: CERTIFICATION_SIGNATURE_STEP_PROMPT,

        validate: value => {
            const errorMessage = CERTIFICATION_SIGNATURE_STEP_REFUSAL_MESSAGE

            const resolvedValue = value?.trim()
            if (!resolvedValue) return errorMessage

            if (!allowedSigners.some(signer => resolvedValue === signer))
                return errorMessage

            return
        }
    })

    if (isCancel(signatureStepResult))
        return refuseAndExit({
            message: CERTIFICATION_CANCELLED_PROMPT_MESSAGE
        })

    outro(CERTIFICATION_OUTRO_MESSAGE)

    return {
        reasoning: reasoningStepResult.trim(),
        signature: signatureStepResult.trim()
    }
}

export {
    type CommitCertificationOptions,
    type CommitCertificationResult,
    runCommitCertification
}
