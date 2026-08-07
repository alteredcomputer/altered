# AGENTS Spec Draft: `*-generated` Tier

Status: INSTALLED (2026-08-07) via the S44 restructure - shared pieces (step-back, copy rules, inviolables) live in root `AGENTS.md`; tier scope/data/revision/graph rules live in `.agents/workflows/auto.md` alongside the AUTO git + escalation behavior. This file is retained as the source draft. Inherits: S5, S27, S28, S43, S44, S46, PRODUCT.md.

---

## Proposed additions

### Generated tier scope

- A fourth quality tier exists below experimental: `*-generated` (promotion chain: generated → experimental → pre-release → stable). AI agents building in this repo may create and modify **only** `*-generated` packages and apps (e.g. `apps/api-generated`, `apps/web-generated`, `apps/raycast-internal-generated`, `packages/*-generated`), plus `.context/*-generated/**` docs.

- Allowed without asking: creating `*-generated` apps/packages; `pnpm` package install/uninstall; catalog modifications in `pnpm-workspace.yaml`; per-package `turbo.json` files inside `*-generated` packages.

- Forbidden (request from the developer instead, as an explicit list at turn end): root `turbo.json`; `.env.example`; any new environment variables (naming + provisioning are operator-owned); any file outside the generated tier and its context folders; all git write operations.

- Generated code may import from `*-experimental` (and higher) packages, never the reverse.

### Generated data layer

- The generated tier uses its own database (`SHARED_GENERATED_STORAGE_DATABASE_URL` - request provisioning from the operator). **Extend-only:** never copy upper-tier tables. Build on upper-tier data in-sync via the experimental ORM/data-access imports, using dual queries + transform/polyfill adapters to merge results (translate → omit → special-case). Design every schema addition for a trivially simple eventual migration upward.

### Revision pass (every chunk, mandatory)

At the end of every generated feature or chunk: (1) conformance refactor toward the existing repo style (read neighboring experimental code; match shape, conciseness, naming, comment rules); (2) verification - tests for every major operation touching user data, manual verification for UX paths; (3) safety scan - error + abort wiring, security edges, boundary validation, no silent data-mutation paths; (4) update `.context/plans-generated/graph.md` (see below); (5) emit the developer-request list + context-file update suggestions.

### Feature/issue graph

`.context/plans-generated/graph.md` is a strict, concise conceptual mirror of the generated codebase: every feature, edge case, quality pass, issue, and remark, tied to a unique purpose and its dependent features. Any code not represented on the graph is either deleted or added to the graph in the same turn. Integrate divergence into this single doc rather than splitting.

### Step-back guardrail

For medium-significance-or-larger problems: before assuming a conclusion, step back and consider all options including reframings of the parent directive itself, on micro and macro levels. Prefer built-in library capabilities over invented machinery (reference cases: TanStack Query cancel/invalidate vs mutex nests; single-ENV watcher patch vs package consolidation hacks).

### Copy rules (all user-facing or marketing text)

- No em dashes - hyphens only. Demographic phrase is "detail-obsessed founders", all-in or all-out. Messaging must trace to `.context/strategy-generated/frameworks/OFFER.md`; never introduce claims outside the offer stack.

### Inviolables

- No unintended mutation or loss of user inputs/data (source or downstream effects). No missing metric collection on funnel-relevant events. No instruction taint that can corrupt a chat's responses. Breach of any of these is a stop-and-report, not a workaround.

---

## Installation notes (operator)

- Root `AGENTS.md` repository-structure section: add `generated` to the tier list in "3-tier quality grade separation" (making it 4).
- Blacklist exception line: extend to `.context/*-generated/**`.
- Optionally place a nested `AGENTS.md` containing the scope/data/revision rules inside each generated app so cheap models can't miss it.
