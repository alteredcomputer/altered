type CertificationSelectStepOption = {
    text: string
} & (
    | {
          shouldBlock: true
          refusalMessage: string
      }
    | {
          shouldBlock: false
          refusalMessage: null
      }
)

type CertificationSelectStep = {
    prompt: string

    /**
     * @remarks The first option is selected by default. It should always be a blocking answer so that blind confirms are refused.
     */
    options: readonly CertificationSelectStepOption[]
}

const CERTIFICATION_INTRO_MESSAGE = "[ COMMIT COVENANT ]"

const createCertificationStagedPathsNoteTitle = (branchName: string) =>
    `STAGED ON ${branchName}`

const CERTIFICATION_SELECT_STEPS: readonly CertificationSelectStep[] = [
    {
        prompt: "[ COMPREHENSION ] - Do you understand **every single line** that's staged here to commit?",

        options: [
            {
                text: "No. I did not write or read this code.",
                shouldBlock: true,
                refusalMessage: "Then it's not yours. Clean it or drop it."
            },
            {
                text: "Partially. I understand most of it - but need it committed for a deployment, cross-machine development, or another reason.",
                shouldBlock: true,
                refusalMessage:
                    "The pressure that caused this is a workflow or mindset defect. Fix it upstream before committing."
            },
            {
                text: "Yes. I wrote and/or read every line, I understand the big picture, and every adjacent effect.",
                shouldBlock: false,
                refusalMessage: null
            }
        ]
    },
    {
        prompt: "[ QUALITY CONTROL ] - Does the code meet the standards set for its designated quality grade and release tier?",

        options: [
            {
                text: "No. The code needs to be changed.",
                shouldBlock: true,
                refusalMessage:
                    "Go back and change it. The tier is a promise, not a vanity label."
            },
            {
                text: "Yes. The code passes all requirements for its designated tier.",
                shouldBlock: false,
                refusalMessage: null
            }
        ]
    },
    {
        prompt: "[ INTENT ] - How is this code progressing the codebase?",

        options: [
            {
                text: "Excessively. Includes accessory code that doesn't move levers and adds tech debt.",
                shouldBlock: true,
                refusalMessage:
                    "Go back and drop it, unless it's low-maintenance and complete end-to-end. Non-critical code is noise."
            },
            {
                text: "Optimally. Adds more than what is currently needed, but for mission-critical reasons.",
                shouldBlock: false,
                refusalMessage: null
            },
            {
                text: "Minimally. Precisely implements the minimum code needed towards our company target.",
                shouldBlock: false,
                refusalMessage: null
            }
        ]
    },
    {
        prompt: "[ MINDSET ] - What state of mind are you operating from?",

        options: [
            {
                text: "Rushed. Sacrificing precision for a faster outcome.",
                shouldBlock: true,
                refusalMessage:
                    "THERE ARE NO SHORTCUTS TO THE BEST PRODUCT. This should be YOUR entropy. Do you want to ruin your codebase again?"
            },
            {
                text: "Tired. Spiritually, mentally, or physically depleted.",
                shouldBlock: true,
                refusalMessage:
                    "You're not your best self when you're tired. Find something else to do, or come back optimized."
            },
            {
                text: "Disrupted. Angry, anxious, or any other unfit emotion.",
                shouldBlock: true,
                refusalMessage:
                    "Neutralize that, and find your grounding. Emotions sway the path. Make decisions and progress from your most aligned form."
            },
            {
                text: "Misaligned. Building because of obligation, circumstance, or external influence.",
                shouldBlock: true,
                refusalMessage:
                    "Conformance to life is not the mission - manifesting your inner truth is. ALTERED is the mechanism. Don't deviate from that."
            },
            {
                text: "Focused. Certain, directional, grounded.",
                shouldBlock: false,
                refusalMessage: null
            }
        ]
    }
]

const CERTIFICATION_REASONING_STEP_PROMPT =
    "[ REASONING ] - Why should this commit exist?"

const createCertificationReasoningStepValidationErrorMessage = (
    minimumReasonLength: number
) => `Say it in at least ${minimumReasonLength} characters.`

const CERTIFICATION_SOURCE_OF_TRUTH_STEP_PROMPT =
    "[ SOURCE OF TRUTH ] - Everything builds on top of this. User data, your company, and your life - as well as lower code tiers. Do you accept that?"

const CERTIFICATION_SOURCE_OF_TRUTH_STEP_REFUSAL_MESSAGE =
    "Then it does not go in."

const CERTIFICATION_SIGNATURE_STEP_PROMPT =
    "[ SIGNATURE ] - To certify that everything above is true, type your signature below."

const CERTIFICATION_SIGNATURE_STEP_REFUSAL_MESSAGE = "Signature rejected."

const CERTIFICATION_OUTRO_MESSAGE = "Certified."

const CERTIFICATION_CANCELLED_PROMPT_MESSAGE = "Aborted."

export {
    CERTIFICATION_CANCELLED_PROMPT_MESSAGE,
    CERTIFICATION_INTRO_MESSAGE,
    CERTIFICATION_OUTRO_MESSAGE,
    CERTIFICATION_REASONING_STEP_PROMPT,
    CERTIFICATION_SELECT_STEPS,
    CERTIFICATION_SIGNATURE_STEP_PROMPT,
    CERTIFICATION_SIGNATURE_STEP_REFUSAL_MESSAGE,
    CERTIFICATION_SOURCE_OF_TRUTH_STEP_PROMPT,
    CERTIFICATION_SOURCE_OF_TRUTH_STEP_REFUSAL_MESSAGE,
    type CertificationSelectStep,
    createCertificationReasoningStepValidationErrorMessage,
    createCertificationStagedPathsNoteTitle
}
