"use client"

import { useEffect } from "react"
import { toggleClientColorScheme } from "./toggle-color-scheme"

const colorSchemeToggleShortcutKey = "d"

function isUsingModifierKey(event: KeyboardEvent) {
    return event.metaKey || event.ctrlKey || event.altKey || event.shiftKey
}

function isTypingInInputField(event: KeyboardEvent) {
    return (
        event.target instanceof HTMLElement &&
        (event.target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))
    )
}

function isKeyboardShortcutKey(event: KeyboardEvent, { key }: { key: string }) {
    return event.key.toLowerCase() === key
}

function isKeyRepeating(event: KeyboardEvent) {
    return event.repeat
}

function shouldActivateKeyboardShortcut(
    event: KeyboardEvent,
    { key }: { key: string }
): boolean {
    const isShortcutKey = isKeyboardShortcutKey(event, { key })
    const isNotUsingModifierKey = !isUsingModifierKey(event)
    const isNotTypingInInputField = !isTypingInInputField(event)
    const isNotRepeating = !isKeyRepeating(event)

    return (
        isShortcutKey &&
        isNotUsingModifierKey &&
        isNotTypingInInputField &&
        isNotRepeating
    )
}

function ColorSchemeToggleShortcut() {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                shouldActivateKeyboardShortcut(event, {
                    key: colorSchemeToggleShortcutKey
                })
            )
                toggleClientColorScheme()
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return null
}

export { ColorSchemeToggleShortcut, isUsingModifierKey }
