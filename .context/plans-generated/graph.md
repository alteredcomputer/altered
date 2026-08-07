# Generated Codebase Graph

The strict conceptual mirror of all `*-generated` code (S30, PRODUCT.md §3). Every feature, edge case, quality pass, issue, and remark lives here, tied to a unique purpose and its dependents. Code not represented here is deleted or added in the same turn. Divergence integrates into this single doc.

Format per node: `id · purpose · depends-on · status · remarks`.

## Nodes

- `g-api-app` · Thin Vercel/Hono shell for generated API · `g-api-pkg` · done · `apps/api-generated`
- `g-api-pkg` · Hono composition: health JSON + `/rpc/*` oRPC handler · `g-rpc-router`, `g-auth-api-key` · done · `@altered/api-generated`
- `g-rpc-router` · oRPC v2 beta (`health.ping`, `thoughts.create|createMany|list`) · `g-server-thoughts`, `g-auth-api-key` · done · ArkType inputs; public ping; authed thoughts
- `g-auth-api-key` · Timing-safe Bearer vs `SHARED_GENERATED_PROVIDER_INTERNAL_API_SECRET` · - · done · Single-admin v1; BA plugin deferred
- `g-auth-reject` · Auth rejection unit tests · `g-auth-api-key` · done · Missing / wrong / non-Bearer → `UNAUTHORIZED`
- `g-server-db` · Generated DB via `SHARED_GENERATED_STORAGE_DATABASE_URL` · - · done · Extend-only; no upper-tier copies
- `g-server-thoughts` · `raw_thoughts` schema + create/createMany/list · `g-server-db` · done · Draft-only content; migrate-upward path
- `g-server-thoughts-test` · Create/list integration test (skips without DB URL) · `g-server-thoughts` · partial · Needs provisioned `SHARED_GENERATED_STORAGE_DATABASE_URL` + `push:db`
- `g-raycast-app` · Raycast shell + password prefs · `g-raycast-pkg` · done · Plain commands (no MicroRenderer)
- `g-raycast-pkg` · oRPC client + TanStack Query + commands · `g-rpc-router` · done · Invalidate via `api.thoughts.key()`
- `g-raycast-ping` · Connectivity command · `g-raycast-pkg` · done · Manual UX pending
- `g-raycast-capture` · Capture Thought → `thoughts.create` · `g-raycast-pkg`, `g-server-thoughts` · done · Manual round-trip pending
- `g-raycast-view` · View Thoughts → `thoughts.list` · `g-raycast-pkg`, `g-server-thoughts` · done · Manual round-trip pending
- `g-raycast-import` · Import Thoughts (files/folders → `createMany`) · `g-raycast-pkg`, `g-server-thoughts` · done · `.txt`/`.md`/`.markdown`/`.mdc` only; S11 raw heuristics
- `g-watch-paths` · Raycast hot-reload via `WATCH_PATHS` + `@raycast/api` patch · `g-raycast-app` · done · Patch at `patches/@raycast__api@1.104.20.patch`; app `dev` watches composition + api `dist/`
- `g-dev-scripts` · Root `dev:generated` / `push:db:generated` · - · done · Manual-mode root scripts for generated filter
- `g-raycast-dev-origin` · Dev Raycast defaults to `http://127.0.0.1:4200` via `environment.isDevelopment` · `g-raycast-pkg` · done · Pref override when set; port constant matches `API_CONFIG_PORT`
- `g-raycast-pref-undefined` · Optional prefs may be `undefined` - coerce before `.trim()` · `g-raycast-dev-origin` · done · Caused ping/capture crash when base URL left empty
- `g-api-deploy` · Generated API on Vercel production origin · `g-api-app` · done · Operator provisioned; Raycast non-dev uses pref = `API_GENERATED_ORIGIN_PRODUCTION`
- `g-better-auth` · Full Better Auth for generated tier · `g-auth-api-key` · queued · When web-generated needs sessions

## Recorded verdicts

- **oRPC:** `@orpc/*@2.0.0-beta.25` via `catalogs.orpc`. Client uses `origin` + `url: "/rpc"` (v2 split).
- **Auth v1:** Custom timing-safe Bearer (old-repo API-key shape), not Better Auth yet.
- **DB ENV:** `SHARED_GENERATED_STORAGE_DATABASE_URL` (from `.env.example`).
- **API key ENV:** `SHARED_GENERATED_PROVIDER_INTERNAL_API_SECRET` (provisioned; matches `.env.example`).
- **Raycast UI:** Plain commands only - MicroRenderer stash used as inspiration only (never popped).
- **Local origin:** Serve reuses `API_CONFIG_PORT`; prod/preview use `API_GENERATED_ORIGIN_*`.
- **EVLog:** Not adopted in this wave.
