# PLAN STATE (Generated)

Last updated: 2026-08-07

## Focus

Wave 0 / internal-raycast substrate: local `pnpm dev:generated` loop + deployed `api-generated` for non-dev Raycast hits.

## Plan linkage

- Primary stub: `.context/plans-generated/stubs/internal-raycast.md`
- Roadmap: `.context/plans-generated/ROADMAP.md` (Wave 0)
- Feature/issue graph: `.context/plans-generated/graph.md`

## Confirmed status

- Generated API + Raycast cockpit + `raw_thoughts` on main (PRs #26-#29).
- `api-generated` deployed; `API_GENERATED_ORIGIN_PRODUCTION` set.
- Root scripts: `dev:generated`, `push:db:generated`, `view:db:generated`.
- Raycast WATCH_PATHS patch wired; icons refreshed; dev origin uses `environment.isDevelopment` → `http://127.0.0.1:4200` (matches `API_CONFIG_PORT`).

## Operator / next

- `pnpm push:db:generated` if schema not pushed yet.
- `pnpm dev:generated` + Raycast prefs (empty base URL locally; API secret set) → ping/capture/import/view.
- For installed/non-dev Raycast: set API Base URL to production `API_GENERATED_ORIGIN_PRODUCTION`.
