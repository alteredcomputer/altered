# Framework: Product Development (Failsafe Process)

Inherits from: S4 (proof bar), S5 (AI-code policy), S6 (distillation pause), S9/S10 (build mechanics).

## 1. The `*-generated` tier

- Promotion chain: `*-generated` → `*-experimental` → `*-pre-release` → `*-stable`. Generated code is a real tier, not a dumping ground — it gives the "far glimpse ahead" of what the product must become, and it may ship to users under the experimental program badge.
- **Agent write-scope: `*-generated` packages and apps ONLY.** Everything else — root configs, ENVs, catalogs, workflows, sibling tiers — is a *request to the developer*, surfaced explicitly at chunk end.
- Deployment isolation: separate API app + subdomain for the generated tier.
- Data isolation: **database per tier**, inherited at the application level. Generated tier imports experimental ORM / data-access functions and translates via polyfill-style adapters (translate → omit → special-case, in that order). No cross-tier schema hacks.

## 2. The revision pass (every chunk, no exceptions)

At the end of every generated chunk or feature:

1. **Conformance:** refactor toward the shape/conciseness/style of the existing ALTERED code (read the repo; match it). The goal: the operator can read it, and any observing agent can scale it.
2. **Verification:** break the feature down and verify behavior to the degree the tier demands — tests for every major operation that touches user data; manual verification for UX paths.
3. **Safety scan:** error + abort-signal wiring complete; security edges/leaks; validation at boundaries; no silent data mutation paths.
4. **Graph sync:** update the feature/issue graph mirror (§3).
5. **Developer requests:** list any out-of-scope changes needed (ENVs, root config), plus context-file update suggestions.

## 3. The feature/issue graph mirror

A strict, concise, conceptual map of the generated codebase — every feature, edge case, quality pass, issue, and remark tied to a unique purpose with its dependent features. Lives beside the code it mirrors (location decided at first build). Purpose: no "stray" code — anything not on the graph is either deleted or added to the graph. This is the fix for the knowledge/alignment drift that killed prior agentic attempts.

## 4. Proof-bar checklist (gates the first sale)

From S4 — all must reach "verified pass with recorded conclusion":

- [ ] History clipping (recent window / ~24h) live; no full-history stuffing.
- [ ] Vector RAG over messages + uploaded notes; retrieval verified on real queries.
- [ ] Self-scheduling (cron/QStash callback) with schedule/reschedule/cancel.
- [ ] Chat SDK concurrency/debounce configured per docs; spam-burst behavior verified.
- [ ] Abort signals wired end-to-end; expensive-generation revert paths (checkpoint intermediary status messages where possible).
- [ ] Message sending via tools (multi-bubble capable); timing naturalness assessed (child plan stub if real latency isn't enough).
- [ ] Error handling + observability pass (Effect where it pays; EVLog considered — decide during build, mark the verdict).
- [ ] Test suite for every major user-data operation.
- [ ] Lint clean; security scan; minimization/refactor pass.

**Inviolables (launch blockers, always):** user input/data loss or unintended mutation (including butterfly effects); missing metric collection; instruction taint that corrupts a chat's responses.

## 5. Hard caps and fallbacks

- Every system build gets a time cap written into its stub before work starts. Breach = execute the pre-written fallback (e.g., DM agent 1-day cap → manual outreach). Caps are enforced by the S13 daily split: revenue actions happen regardless of build state.
- "It's easy enough to do it all" (S10) is conditional: first bloat/bug spiral on a claimed-trivial item demotes it to its fallback.

## 6. Post-revenue refinement clock

Manual refactoring to operator spec, distillation resume (S6), Effect conversion, and quality promotion all run on the product clock, funded by the program. The generated tier's existence is what makes "go back and refine everything to my spec" possible without blocking revenue now.
