# Stub: Foundation + Internal Raycast Cockpit

Inherits: S5, S10, S27, S28, S30. Cap: 1 off-day combined with Wave 0 scaffold. Fallback: pnpm scripts as control surface.

## Objective

`apps/api-generated` (Hono + oRPC v2 + Better Auth API key) and `apps/raycast-internal-generated` (operator cockpit) - the substrate every other stub builds on.

## Locked decisions

- oRPC v2 `@beta` inside Hono; docs: https://v2.orpc.dev/llms.txt (fallback https://orpc.dev/llms.txt). TanStack Query on the Raycast side, wired like the old repo (`altered-again`) launcher - reference its patterns for optimistic updates; use built-in query cancel/invalidate/wait, never mutex/useEffect nests (S9 guardrail).
- Auth: Better Auth per old repo setup, **API key instead of OIDC** for the internal extension. Key stored via Raycast preferences password field (https://developers.raycast.com/api-reference/preferences).
- Raycast app: copy tree from branch `feat/raycast-internal-base-init`, rename experimental→generated, **apply stash 0 (never drop/pop)** - treat as inspiration/demo baseline.
- Database: `GENERATED_DATABASE_URL` (operator provisions; separate DB, extend-only per S28 - import experimental ORM for upper-tier data, polyfill adapters for shape mismatches).
- Also port: the old repo's notes/thoughts upload launcher command (UI + upload mechanics), conformed to current "raw" thought heuristics (S11) - feeds memory-rag.

## Build nuances

- Vercel deploy for api-generated on its own subdomain (S5); request domain naming from operator.
- Raycast hot-reload external-package watcher: use the operator's single-ENV-path patch approach if needed (S9 reference case).
- Keep the extension non-dynamic (plain commands, no dynamic renderer - that branch stays parked).

## Assumptions (marked)

- Drizzle on the generated DB matching experimental conventions. [launch]
- Single admin API key (operator-only cockpit) - no multi-user auth in v1. [later]

## Verification

Typecheck/lint clean via `pnpm check`; round-trip test: Raycast command → oRPC → DB read/write; auth rejection path verified. Graph.md updated.
