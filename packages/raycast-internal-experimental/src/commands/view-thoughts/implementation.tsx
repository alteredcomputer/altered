import { ActionPanel, Icon } from "@raycast/api"
import { GoToAction } from "../../actions/go-to"
import { GoToPreviousAction } from "../../actions/go-to-previous"
import { ToggleCollectionLayoutAction } from "../../actions/toggle-collection-layout"
import { ToggleIconVisibilityAction } from "../../actions/toggle-icon-visibility"
import {
    COLLECTION_GRID_COLUMNS,
    COLLECTION_GRID_INSET,
    useCollection
} from "../../components/collection"
import { useMicroRenderer } from "../../micro-renderer/context"
import {
    DISTILL_MESSAGE_TOOL_POC_ACTION_ID,
    DISTILL_MESSAGE_TOOL_POC_SUBTITLE,
    DISTILL_MESSAGE_TOOL_POC_TITLE
} from "./distill-message-tool-poc/definitions"
import {
    QUERY_MEMORY_TOOL_POC_ACTION_ID,
    QUERY_MEMORY_TOOL_POC_SUBTITLE,
    QUERY_MEMORY_TOOL_POC_TITLE
} from "./query-memory-tool-poc/definitions"

const VIEW_THOUGHTS_ITEMS = [
    {
        interfaceId: DISTILL_MESSAGE_TOOL_POC_ACTION_ID,
        title: DISTILL_MESSAGE_TOOL_POC_TITLE,
        subtitle: DISTILL_MESSAGE_TOOL_POC_SUBTITLE
    },
    {
        interfaceId: QUERY_MEMORY_TOOL_POC_ACTION_ID,
        title: QUERY_MEMORY_TOOL_POC_TITLE,
        subtitle: QUERY_MEMORY_TOOL_POC_SUBTITLE
    }
] as const

function ViewThoughtsItemActions({ interfaceId }: { interfaceId: string }) {
    return (
        <ActionPanel>
            <ActionPanel.Section>
                <GoToAction interfaceId={interfaceId} />
            </ActionPanel.Section>

            <ActionPanel.Section>
                <GoToPreviousAction />
                <ToggleCollectionLayoutAction />
                <ToggleIconVisibilityAction />
            </ActionPanel.Section>
        </ActionPanel>
    )
}

function ViewThoughtsInterface() {
    const Collection = useCollection()
    const { navigationTitle } = useMicroRenderer()

    return (
        <Collection
            columns={COLLECTION_GRID_COLUMNS}
            inset={COLLECTION_GRID_INSET}
            navigationTitle={navigationTitle}
            searchBarPlaceholder="Search thoughts..."
        >
            {VIEW_THOUGHTS_ITEMS.map(item => (
                <Collection.Item
                    actions={
                        <ViewThoughtsItemActions
                            interfaceId={item.interfaceId}
                        />
                    }
                    content={Icon.Document}
                    key={item.interfaceId}
                    subtitle={item.subtitle}
                    title={item.title}
                />
            ))}
        </Collection>
    )
}

export { ViewThoughtsInterface }
