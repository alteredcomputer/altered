import { ActionPanel } from "@raycast/api"
import { CopyDeeplinkAction } from "../../actions/copy-deeplink"
import { GoToAction } from "../../actions/go-to"
import { GoToPreviousAction } from "../../actions/go-to-previous"
import { InstallShortcutAction } from "../../actions/install-shortcut"
import { OpenInBrowserAction } from "../../actions/open-in-browser"
import { ToggleCollectionLayoutAction } from "../../actions/toggle-collection-layout"
import { ToggleIconVisibilityAction } from "../../actions/toggle-icon-visibility"
import {
    COLLECTION_GRID_COLUMNS,
    COLLECTION_GRID_INSET,
    useCollection
} from "../../components/collection"
import { useMicroRenderer } from "../../micro-renderer/context"
import { usePreferences } from "../../preferences/use"
import {
    ALTERED_ONBOARDING_ACTION_ID,
    ALTERED_ONBOARDING_DESCRIPTION,
    ALTERED_ONBOARDING_ICON,
    ALTERED_ONBOARDING_SUBTITLE,
    ALTERED_ONBOARDING_TITLE
} from "../altered-onboarding/definitions"
import {
    CAPTURE_THOUGHT_ACTION_ID,
    CAPTURE_THOUGHT_DESCRIPTION,
    CAPTURE_THOUGHT_ICON,
    CAPTURE_THOUGHT_SUBTITLE,
    CAPTURE_THOUGHT_TITLE,
    CAPTURE_THOUGHT_TRIGGER_PHRASE
} from "../capture-thought/definitions"
import {
    SET_UP_SHORTCUTS_ACTION_ID,
    SET_UP_SHORTCUTS_DESCRIPTION,
    SET_UP_SHORTCUTS_ICON,
    SET_UP_SHORTCUTS_SUBTITLE,
    SET_UP_SHORTCUTS_TITLE
} from "../set-up-shortcuts/definitions"
import {
    VIEW_THOUGHTS_ACTION_ID,
    VIEW_THOUGHTS_DESCRIPTION,
    VIEW_THOUGHTS_ICON,
    VIEW_THOUGHTS_SUBTITLE,
    VIEW_THOUGHTS_TITLE,
    VIEW_THOUGHTS_TRIGGER_PHRASE
} from "../view-thoughts/definitions"

const ACTION_PALETTE_ITEMS = [
    {
        interfaceId: CAPTURE_THOUGHT_ACTION_ID,
        title: CAPTURE_THOUGHT_TITLE,
        subtitle: CAPTURE_THOUGHT_SUBTITLE,
        description: CAPTURE_THOUGHT_DESCRIPTION,
        icon: CAPTURE_THOUGHT_ICON,
        keywords: [CAPTURE_THOUGHT_TRIGGER_PHRASE]
    },
    {
        interfaceId: SET_UP_SHORTCUTS_ACTION_ID,
        title: SET_UP_SHORTCUTS_TITLE,
        subtitle: SET_UP_SHORTCUTS_SUBTITLE,
        description: SET_UP_SHORTCUTS_DESCRIPTION,
        icon: SET_UP_SHORTCUTS_ICON,
        keywords: [] as string[]
    },
    {
        interfaceId: ALTERED_ONBOARDING_ACTION_ID,
        title: ALTERED_ONBOARDING_TITLE,
        subtitle: ALTERED_ONBOARDING_SUBTITLE,
        description: ALTERED_ONBOARDING_DESCRIPTION,
        icon: ALTERED_ONBOARDING_ICON,
        keywords: [] as string[]
    },
    {
        interfaceId: VIEW_THOUGHTS_ACTION_ID,
        title: VIEW_THOUGHTS_TITLE,
        subtitle: VIEW_THOUGHTS_SUBTITLE,
        description: VIEW_THOUGHTS_DESCRIPTION,
        icon: VIEW_THOUGHTS_ICON,
        keywords: [VIEW_THOUGHTS_TRIGGER_PHRASE]
    }
] as const

function ActionPaletteItemActions({
    interfaceId,
    title,
    description
}: {
    interfaceId: string
    title: string
    description: string
}) {
    return (
        <ActionPanel>
            <ActionPanel.Section>
                <GoToAction interfaceId={interfaceId} />

                <InstallShortcutAction
                    actionId={interfaceId}
                    description={description}
                    title={title}
                />

                <CopyDeeplinkAction actionId={interfaceId} title={title} />

                <OpenInBrowserAction />
            </ActionPanel.Section>

            <ActionPanel.Section>
                <GoToPreviousAction />
                <ToggleCollectionLayoutAction />
                <ToggleIconVisibilityAction />
            </ActionPanel.Section>
        </ActionPanel>
    )
}

function ActionPaletteInterface() {
    const Collection = useCollection()
    const { navigationTitle } = useMicroRenderer()
    const { isIconVisible, tintColor } = usePreferences()

    return (
        <Collection
            columns={COLLECTION_GRID_COLUMNS}
            inset={COLLECTION_GRID_INSET}
            navigationTitle={navigationTitle}
            searchBarPlaceholder="Search actions..."
        >
            <Collection.Section
                subtitle="Manage your Brain"
                title="ALTERED Core"
            >
                {ACTION_PALETTE_ITEMS.map(item => (
                    <Collection.Item
                        actions={
                            <ActionPaletteItemActions
                                description={item.description}
                                interfaceId={item.interfaceId}
                                title={item.title}
                            />
                        }
                        content={{ source: item.icon, tintColor }}
                        icon={
                            isIconVisible.value
                                ? { source: item.icon, tintColor }
                                : undefined
                        }
                        key={item.interfaceId}
                        keywords={[...item.keywords]}
                        subtitle={item.subtitle}
                        title={item.title}
                    />
                ))}
            </Collection.Section>
        </Collection>
    )
}

export { ActionPaletteInterface }
