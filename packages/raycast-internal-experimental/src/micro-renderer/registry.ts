import {
    ACTION_PALETTE_INTERFACE_ID,
    ACTION_PALETTE_INTERFACE_TITLE
} from "../commands/action-palette/definitions"
import { ActionPaletteInterface } from "../commands/action-palette/interface"
import {
    ALTERED_ONBOARDING_ACTION_ID,
    ALTERED_ONBOARDING_TITLE
} from "../commands/altered-onboarding/definitions"
import { AlteredOnboardingInterface } from "../commands/altered-onboarding/implementation"
import {
    CAPTURE_THOUGHT_ACTION_ID,
    CAPTURE_THOUGHT_TITLE
} from "../commands/capture-thought/definitions"
import { CaptureThoughtInterface } from "../commands/capture-thought/implementation"
import {
    SET_UP_SHORTCUTS_ACTION_ID,
    SET_UP_SHORTCUTS_TITLE
} from "../commands/set-up-shortcuts/definitions"
import { SetUpShortcutsInterface } from "../commands/set-up-shortcuts/implementation"
import {
    VIEW_THOUGHTS_ACTION_ID,
    VIEW_THOUGHTS_TITLE
} from "../commands/view-thoughts/definitions"
import {
    DISTILL_MESSAGE_TOOL_POC_ACTION_ID,
    DISTILL_MESSAGE_TOOL_POC_TITLE
} from "../commands/view-thoughts/distill-message-tool-poc/definitions"
import { DistillMessageToolPocInterface } from "../commands/view-thoughts/distill-message-tool-poc/implementation"
import { ViewThoughtsInterface } from "../commands/view-thoughts/implementation"
import {
    QUERY_MEMORY_TOOL_POC_ACTION_ID,
    QUERY_MEMORY_TOOL_POC_TITLE
} from "../commands/view-thoughts/query-memory-tool-poc/definitions"
import { QueryMemoryToolPocInterface } from "../commands/view-thoughts/query-memory-tool-poc/implementation"
import type { InterfaceDefinition } from "./definitions"

const INTERFACE_REGISTRY = {
    [ACTION_PALETTE_INTERFACE_ID]: {
        id: ACTION_PALETTE_INTERFACE_ID,
        title: ACTION_PALETTE_INTERFACE_TITLE,
        component: ActionPaletteInterface
    },
    [CAPTURE_THOUGHT_ACTION_ID]: {
        id: CAPTURE_THOUGHT_ACTION_ID,
        title: CAPTURE_THOUGHT_TITLE,
        component: CaptureThoughtInterface
    },
    [SET_UP_SHORTCUTS_ACTION_ID]: {
        id: SET_UP_SHORTCUTS_ACTION_ID,
        title: SET_UP_SHORTCUTS_TITLE,
        component: SetUpShortcutsInterface
    },
    [ALTERED_ONBOARDING_ACTION_ID]: {
        id: ALTERED_ONBOARDING_ACTION_ID,
        title: ALTERED_ONBOARDING_TITLE,
        component: AlteredOnboardingInterface
    },
    [VIEW_THOUGHTS_ACTION_ID]: {
        id: VIEW_THOUGHTS_ACTION_ID,
        title: VIEW_THOUGHTS_TITLE,
        component: ViewThoughtsInterface
    },
    [DISTILL_MESSAGE_TOOL_POC_ACTION_ID]: {
        id: DISTILL_MESSAGE_TOOL_POC_ACTION_ID,
        title: DISTILL_MESSAGE_TOOL_POC_TITLE,
        component: DistillMessageToolPocInterface
    },
    [QUERY_MEMORY_TOOL_POC_ACTION_ID]: {
        id: QUERY_MEMORY_TOOL_POC_ACTION_ID,
        title: QUERY_MEMORY_TOOL_POC_TITLE,
        component: QueryMemoryToolPocInterface
    }
} as const satisfies Record<string, InterfaceDefinition>

export { INTERFACE_REGISTRY }
