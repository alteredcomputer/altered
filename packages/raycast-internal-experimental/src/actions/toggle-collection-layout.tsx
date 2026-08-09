import { Action, Icon } from "@raycast/api"
import { usePreferences } from "../preferences/use"

function ToggleCollectionLayoutAction() {
    const { isIconVisible, collectionLayout, tintColor } = usePreferences()

    return (
        <Action
            icon={
                isIconVisible.value
                    ? {
                          source:
                              collectionLayout.value === "list"
                                  ? Icon.AppWindowGrid2x2
                                  : Icon.List,
                          tintColor
                      }
                    : undefined
            }
            onAction={collectionLayout.toggle}
            shortcut={{
                modifiers: ["cmd", "shift"],
                key: "l"
            }}
            title={
                collectionLayout.value === "list"
                    ? "Switch to Grid Layout"
                    : "Switch to List Layout"
            }
        />
    )
}

export { ToggleCollectionLayoutAction }
