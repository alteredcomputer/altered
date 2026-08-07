# PLAN STATE (Generated)

Last updated: 2026-08-07

## Focus

Wave 0 / internal-raycast substrate for the `*-generated` tier under AUTO mode: `apps/api-generated` + `apps/raycast-internal-generated` with oRPC v2, Bearer API-key auth, `raw_thoughts` CRUD, and notes import.

## Plan linkage

- Primary stub: `.context/plans-generated/stubs/internal-raycast.md`
- Roadmap: `.context/plans-generated/ROADMAP.md` (Wave 0)
- Feature/issue graph: `.context/plans-generated/graph.md`

## Confirmed status

- Generated shells: api / server / raycast (app + composition packages).
- Catalogs: `orpc`, `raycast`, `react`; `@tanstack/react-query` in root catalog.
- Auth rejection unit tests present.
- Import Thoughts command ports old-repo filesystem upload (supported text extensions only).
- Thoughts DB integration test skips until `GENERATED_DATABASE_URL` is provisioned.

## Blocked on operator

- Provision `GENERATED_DATABASE_URL` (and add to `.env.example`; supersedes `SHARED_GENERATED_STORAGE_DATABASE_URL` naming for generated code).
- Provision `GENERATED_INTERNAL_API_KEY` + add to `.env.example`.
- Optional: Raycast `WATCH_PATHS` patch from `feat/raycast-internal-base-init`.
- Optional: Vercel project/domain for `api-generated`.
