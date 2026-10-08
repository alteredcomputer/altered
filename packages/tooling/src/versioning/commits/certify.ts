import { confirm, intro, note, outro, select, text } from "@clack/prompts"
import { certificationConfig } from "../certification/config"
import {
    CERTIFICATION_CANCELLED_PROMPT_MESSAGE,
    CERTIFICATION_INTRO_MESSAGE,
    CERTIFICATION_NON_INTERACTIVE_REFUSAL_MESSAGE,
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
import { refuseAndFinish } from "../certification/utils/clack/refuse-and-finish"
import type { CommitContext } from "../certification/utils/get-commit-context"
import { isInteractiveTerminal } from "../certification/utils/is-interactive-terminal"

type CommitCertificationOptions = {
    context: CommitContext & {
        isAmending: boolean

        /**
         * @remarks Only relevant when a commit is being amended.
         */
        previousCertificationReasoning: string | null
    }
}

type CommitCertificationResult = {
    reasoning: string

    signature: string
}

async function runCommitCertification({
    context
}: CommitCertificationOptions): Promise<CommitCertificationResult | null> {
    const { minimumReasonLength, allowedSigners } = certificationConfig

    if (!isInteractiveTerminal())
        return refuseAndFinish({
            message: CERTIFICATION_NON_INTERACTIVE_REFUSAL_MESSAGE
        })

    intro(CERTIFICATION_INTRO_MESSAGE)

    /**
     * @todo P3: Fix wrapping of overflowing staged paths using the `format` parameter of the `note` prompt.
     */
    const stagedPathsNoteContent = context.stagedPaths.join("\n")

    note(
        stagedPathsNoteContent,
        createCertificationStagedPathsNoteTitle({
            branchName: context.branch,
            isAmending: context.isAmending
        })
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
            return refuseAndFinish({
                message: CERTIFICATION_CANCELLED_PROMPT_MESSAGE
            })

        const selectedOption = selectStep.options[selectStepResult]

        if (selectedOption?.shouldBlock)
            return refuseAndFinish({ message: selectedOption.refusalMessage })
    }

    const reasoningStepResult = await text({
        message: CERTIFICATION_REASONING_STEP_PROMPT,

        placeholder: context.previousCertificationReasoning ?? undefined,
        defaultValue: context.previousCertificationReasoning ?? undefined,

        validate: value => {
            const lengthErrorMessage =
                createCertificationReasoningStepValidationErrorMessage(
                    minimumReasonLength
                )

            /**
             * @remarks Since Clack applies the default *after* validation, we must apply it manually before validating. This could probably be a GitHub issue.
             */
            const resolvedValue =
                value?.trim() || context.previousCertificationReasoning

            if (!resolvedValue) return lengthErrorMessage

            if (resolvedValue.length < minimumReasonLength)
                return lengthErrorMessage

            return
        }
    })

    if (isCancel(reasoningStepResult))
        return refuseAndFinish({
            message: CERTIFICATION_CANCELLED_PROMPT_MESSAGE
        })

    const sourceOfTruthStepResult = await confirm({
        message: CERTIFICATION_SOURCE_OF_TRUTH_STEP_PROMPT,
        initialValue: false
    })

    if (isCancel(sourceOfTruthStepResult))
        return refuseAndFinish({
            message: CERTIFICATION_CANCELLED_PROMPT_MESSAGE
        })

    if (!sourceOfTruthStepResult)
        return refuseAndFinish({
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
        return refuseAndFinish({
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
