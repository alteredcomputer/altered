import { type } from "arktype"

const ACTION_PALETTE_COMMAND_NAME = "action-palette"

const GLOBAL_CACHE_NAMESPACE = "*"

const actionPaletteLaunchContextSchema = type({
    actionId: "string"
})

type ActionPaletteLaunchContext = typeof actionPaletteLaunchContextSchema.infer

const ACTION_PALETTE_INTERFACE_ID = "action-palette"

const ACTION_PALETTE_INTERFACE_TITLE = "Action Palette"

export {
    ACTION_PALETTE_INTERFACE_ID,
    ACTION_PALETTE_INTERFACE_TITLE,
    ACTION_PALETTE_COMMAND_NAME,
    type ActionPaletteLaunchContext,
    actionPaletteLaunchContextSchema,
    GLOBAL_CACHE_NAMESPACE
}
