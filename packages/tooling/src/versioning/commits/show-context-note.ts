import { note } from "@clack/prompts"
import {
    CERTIFICATION_COMMIT_CONTEXT_NOTE_PROMPT_SECTION_TITLES_MAP,
    CERTIFICATION_CONTEXT_NOTE_NO_CHANGES_MESSAGE,
    CERTIFICATION_CONTEXT_NOTE_TITLE,
    createCertificationContextNoteBranchLine
} from "../certification/copy"
import { createFileTree } from "../certification/utils/file-tree/create-file-tree"
import {
    getFileTreeLines,
    renderFileTree
} from "../certification/utils/file-tree/render-file-tree"
import type { GitCommitContext } from "../certification/utils/get-commit-context"
import type { GitDiffFileChange } from "../certification/utils/get-diff-file-changes"

/**
 * @remarks Clack's note frame takes 3 columns on each side of the content.
 */
const NOTE_PROMPT_FRAME_WIDTH = 6

const DEFAULT_TERMINAL_WIDTH = 80

type GitCommitContextNotePromptSection = {
    title: string

    fileChanges: GitDiffFileChange[]
}

function showGitCommitContextNotePrompt({
    context
}: {
    context: GitCommitContext
}): void {
    const {
        staged: stagedSectionTitle,
        existing: existingSectionTitle,
        amended: amendedSectionTitle,
        resulting: resultingSectionTitle
    } = CERTIFICATION_COMMIT_CONTEXT_NOTE_PROMPT_SECTION_TITLES_MAP

    const maxOutputColumns =
        (process.stdout.columns ?? DEFAULT_TERMINAL_WIDTH) -
        NOTE_PROMPT_FRAME_WIDTH

    const noteSections: GitCommitContextNotePromptSection[] =
        context.amendFileChanges
            ? [
                  {
                      title: existingSectionTitle,
                      fileChanges: context.amendFileChanges.existing
                  },
                  {
                      title: amendedSectionTitle,
                      fileChanges: context.stagedFileChanges
                  },
                  {
                      title: resultingSectionTitle,
                      fileChanges: context.amendFileChanges.resulting
                  }
              ]
            : [
                  {
                      title: stagedSectionTitle,
                      fileChanges: context.stagedFileChanges
                  }
              ]

    const sectionTreeLines = noteSections.map(({ fileChanges }) =>
        getFileTreeLines({
            nodes: createFileTree({ fileChanges }),
            prefix: "",
            isRoot: true
        })
    )

    //  Shares one status column across every section, plus 2 characters for the status itself.

    const longestTreeLineLength = Math.max(
        0,
        ...sectionTreeLines.flat().map(line => line.text.length)
    )

    const treeWidth = Math.min(longestTreeLineLength + 2, maxOutputColumns)

    const sectionLines = noteSections.flatMap(({ title }, index) => {
        const treeLines = sectionTreeLines[index] ?? []

        const fileChangeLines = treeLines.length
            ? renderFileTree({ lines: treeLines, width: treeWidth })
            : [CERTIFICATION_CONTEXT_NOTE_NO_CHANGES_MESSAGE]

        return ["", title, ...fileChangeLines]
    })

    const lines = [
        createCertificationContextNoteBranchLine(context.branch),

        ...sectionLines
    ]

    note(lines.join("\n"), CERTIFICATION_CONTEXT_NOTE_TITLE)
}

export { showGitCommitContextNotePrompt }
