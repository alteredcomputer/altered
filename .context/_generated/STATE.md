# PLAN STATE (Generated)

Last updated: 2026-07-30

## Active session

- Cursor chat: Raycast hardcoded Action Palette conversion

**Direction change (2026-07-28):** Scrapped the in-progress dynamic thought/builtin renderer + compiler WIP in favor of near-hardcoded Raycast commands. Dynamic definitions remain on another branch for later.

**Hardcoded polish (2026-07-28):** Shared `useCollection()` (List|Grid, 7 cols, Large inset). …

**MicroRenderer (2026-07-30):** Ditched Raycast `push`/`pop`. Root hot-swaps via `path: InterfaceID[]` + `INTERFACE_REGISTRY`. Titles = `path` titles joined with ` / `. Nav via cmd-left / cmd-right (`GoToPreviousAction` / `GoToAction`). Launch deeplink seeds `[action-palette, actionId]`.

## Focus

Secondary active slice: Raycast internal experimental Action Palette — hardcoded command views with shared Raycast Actions, shortcut deeplinks via `launchContext.actionId` (kebab command IDs).

Primary focus remains the iMessage POC path (unchanged).

### Raycast Action Palette (hardcoded)

- Root: `commands/action-palette` — ALTERED Core list/grid of four actions.
- Commands under `packages/raycast-internal-experimental/src/commands/`:
  - `capture-thought` — minimal Form POC (content → log / toast / close / popToRoot).
  - `set-up-shortcuts` — existing markdown + copy-directory/settings flow.
  - `altered-onboarding` — stub Detail markdown.
  - `view-thoughts` — nested Distill Message / Query Memory POC Details.
- Launch: `actionId` still used; values are kebab command folder names. On mount, `useEffect` + `push` opens the matching view (poppable back to the palette list).
- Shared: `src/actions/*` (close, go-to-previous, toggle layout/icons, install shortcut, copy deeplink, open-in-browser toast stub, copy markdown) + `src/preferences/*`.
- Deleted: `renderer/`, action-palette `interfaces/`, raycast `data/` resolvers, uncommitted `core-experimental/src/data/**` builtins/access.
- Dropped unused `@altered/core-experimental` + `nanoid` deps from the Raycast package.

### Raycast monorepo HMR (still in place)

- `@raycast/api@1.104.20` patched via `WATCH_PATHS`; plan: `.context/_generated/plans/raycast-monorepo-dev-watch.md`.

## Plan linkage

- Primary vertical scaffold: `.context/_generated/plans/imessage-server-poc.md`
- Preview promotion: `.context/_generated/plans/vercel-preview-promotion-api-experimental.md`
- Chat SDK history: `.context/_generated/plans/chat-sdk-history-sendblue-adapter-resolution.md`
- Architecture: `.context/_generated/plans/monorepo-architecture.md`
- Human timing (deferred): `.context/_generated/plans/imessage-human-timing-emulation.md`
- **Superseded for now:** `.context/_generated/plans/raycast-push-interface-gate.md` (dynamic renderer gate — not applicable to hardcoded path)

## Confirmed status

- iMessage adapter / Drizzle / owned history / memory-backed reply loop: **unchanged from prior STATE**.
- Raycast package emit + app config: **unchanged**.
- Action Palette: **hardcoded MVP replacing dynamic renderer WIP**.
- Shortcut script install: writes `0o755`; copies icon into `supportPath/assets/` and embeds relative `@raycast.icon` (`../../assets/...` from `shortcuts/script-commands/`).

## Next execution order

1. Manual Raycast verify: reinstall shortcuts → Reload Script Commands → confirm icons + executability; then list → push commands, cmd+← pop, shortcut deeplink `actionId`, capture form, set-up-shortcuts, view-thoughts nesting, layout/icon toggles.
2. iMessage: production webhook forwarding to local tunnel for admin-only `/dev` (prior next step).
3. Provider message-id dedupe.
4. POC solidification / multi-bubble send.
