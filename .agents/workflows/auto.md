# AUTO Workflow

The autonomous workflow for the `*-generated` tier. Applies whenever the task creates or modifies `*-generated` apps/packages or `.context/*-generated/**` docs. The shared rules in root `AGENTS.md` still apply; where this file conflicts with them (notably git), this file wins.

# Operating Mode

- Run at lowest operator input: no chunk-stop reviews, no permission-seeking for in-scope work, and no long completion reports. Summaries are a few sentences unless asked for more.

- Target UX: the operator says "find the next non-completed task or plan and finish it" from any device, and returns to a polished, guardrailed, finished feature.

- Escalate ONLY for: (a) deep, hard, newly-uncovered conceptual barriers - return these to the orchestrator chat rather than guessing through them; (b) out-of-bounds or sensitive actions (service provisioning, root config, new environment variables) - request these from the operator as an explicit list.

# Git (overrides the read-only default)

- Work on a dedicated branch per task. Commit in small, operator-style commits (match the conventional-commit style in `git log`). Push, then merge to main - or open a PR if merging isn't possible. Never rewrite history on shared branches.

- Never drop, pop, or otherwise mutate stashes. Reference stashes by message or backing branch, never by index.

# Scope

- A fourth quality tier exists below experimental: `*-generated` (promotion chain: generated → experimental → pre-release → stable). In AUTO mode you may create and modify **only** `*-generated` packages and apps (e.g. `apps/api-generated`, `apps/web-generated`, `apps/raycast-internal-generated`, `packages/*-generated`), plus `.context/*-generated/**` docs.

- Allowed without asking: creating `*-generated` apps/packages; `pnpm` package install/uninstall; catalog modifications in `pnpm-workspace.yaml`; per-package `turbo.json` files inside `*-generated` packages.

- Forbidden (escalate to the operator instead): root `turbo.json`; `.env.example`; any new environment variables (naming + provisioning are operator-owned); any file outside the generated tier and its context folders.

- Generated code may import from `*-experimental` (and higher) packages, never the reverse.

# Data Layer

- The generated tier uses its own database (`GENERATED_DATABASE_URL` - request provisioning from the operator if missing). **Extend-only:** never copy upper-tier tables. Build on upper-tier data in-sync via the experimental ORM/data-access imports, using dual queries + transform/polyfill adapters to merge results (translate → omit → special-case). Design every schema addition for a trivially simple eventual migration upward.

# iMessage Resources

- The generated tier has its own isolated Sendblue number/credentials (generated-scoped env vars). Always wire these, never the experimental ones. Prefer simulation scripts and repo tests over live-number testing wherever possible.

# Context + Plans

- Boot from the relevant stub in `.context/plans-generated/stubs/` and `.context/plans-generated/ROADMAP.md`. Keep `.context/plans-generated/graph.md` synchronized (see below).

# Revision Pass (every chunk, mandatory - revise, then continue without stopping)

At the end of every generated feature or chunk: (1) conformance refactor toward the existing repo style (read neighboring experimental code; match shape, conciseness, naming, comment rules); (2) verification - tests for every major operation touching user data, manual verification for UX paths; (3) safety scan - error + abort wiring, security edges, boundary validation, no silent data-mutation paths; (4) update `.context/plans-generated/graph.md`; (5) fold any operator requests + context-file update suggestions into the end-of-task summary.

# Feature/Issue Graph

`.context/plans-generated/graph.md` is a strict, concise conceptual mirror of the generated codebase: every feature, edge case, quality pass, issue, and remark, tied to a unique purpose and its dependent features. Any code not represented on the graph is either deleted or added to the graph in the same turn. Integrate divergence into this single doc rather than splitting.

# Sanitation

- Anything committed to the repo that originated from chats or tool output (transcripts, exports, logs) gets a credential-scrub pass before commit: connection strings, tokens, key-shaped strings. Avoid echoing secrets into tool calls when avoidable - read env indirectly.
