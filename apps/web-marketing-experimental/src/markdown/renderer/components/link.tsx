"use client"

import Link from "next/link"
import { type KeyboardEvent, type ReactNode, useCallback } from "react"
import { getMarkdownLinkOverrideConfig } from "../links/overrides/get"

type MarkdownLinkProps = {
    target: { text: string }

    children: ReactNode
}

type MarkdownActionOverrideLinkProps = MarkdownLinkProps & {
    actionOverride: (text: string) => void
}

function MarkdownActionOverrideLink({
    target,
    actionOverride,

    ...props
}: MarkdownActionOverrideLinkProps) {
    const performAction = useCallback(
        () => actionOverride(target.text),
        [actionOverride, target.text]
    )

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const actionKeys = ["Enter", " "]

            const isActionKey = actionKeys.includes(event.key)
            if (!isActionKey) return

            event.preventDefault()

            performAction()
        },
        [performAction]
    )

    return (
        //  biome-ignore lint/a11y/useSemanticElements: The `<button>` element renders as an inline block, pushing longer labels to the next line rather than having them wrap naturally like normal text does. Using `<span>` as a base fixes that.
        <span
            className="cursor-pointer font-bold text-accent hover:underline focus-visible:underline"
            onClick={performAction}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            {props.children}
        </span>
    )
}

function MarkdownLink({ target, ...props }: MarkdownLinkProps) {
    const overrideConfig = getMarkdownLinkOverrideConfig({
        query: {
            target: { text: target.text }
        }
    })

    const actionOverride = overrideConfig?.target?.action

    if (actionOverride)
        return (
            <MarkdownActionOverrideLink
                actionOverride={actionOverride}
                target={target}
            >
                {props.children}
            </MarkdownActionOverrideLink>
        )

    return (
        <Link
            className="font-bold text-accent hover:underline focus-visible:underline"
            href={target.text}
        >
            {props.children}
        </Link>
    )
}

export { MarkdownLink }
