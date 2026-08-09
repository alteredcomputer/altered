# Branch STATE — `feat/raycast-internal-base-init`

Last updated: 2026-07-31

## Cursor chat

- [Raycast hardcoded Action Palette](fabc585f-b835-43d6-b672-9d64ba3a1d2c)
- Transcript: `file:///Users/inducingchaos/.cursor/projects/Users-inducingchaos-Workspace-containers-altered/agent-transcripts/fabc585f-b835-43d6-b672-9d64ba3a1d2c/fabc585f-b835-43d6-b672-9d64ba3a1d2c.jsonl`

## Summary

WIP on the Raycast internal experimental Action Palette: abandoned the dynamic thought/builtin renderer approach for this pass, rebuilt near-hardcoded Interface views, then replaced Raycast native `push`/`pop` with a minimal **MicroRenderer** (id-path stack + registry hot-swap).

## Progress

- **Done:** Hardcoded Interfaces under `packages/raycast-internal-experimental/src/commands/` — Action Palette, Capture Thought, Set Up Shortcuts, ALTERED Onboarding, View Thoughts (+ Distill / Query Memory POCs).
- **Done:** Shared Raycast Actions, preferences (layout/icons), `useCollection()`, shortcut install/uninstall, deeplink launch via `launchContext.actionId` (kebab ids).
- **Done:** MicroRenderer — `path: InterfaceID[]`, `INTERFACE_REGISTRY`, titles as `A / B / C`, nav via cmd-left / cmd-right (no native stack).
- **Dropped (uncommitted / other branch):** dynamic renderer, builtins data access layer.
- **Status:** Compiles (`pnpm check` last green). Manual Raycast UX verification in progress; stash captures full WIP before context switch.
