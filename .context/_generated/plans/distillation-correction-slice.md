# Distillation Correction Sub-Plan (post slice-10)

Status: **direction drafting** — mindset shifts recorded; schema/keyword architecture pending answers. Critical instruction + metric fixes land after Q&A lock.

Grounding: slice batch `WiOramEZX6DiPb30CBY6l` (first 10 oldest, overwrite+index) + user corrections 2026-07-28.

Companion: `thought-distillation-poc.md`, `memory-query-poc.md`, `distillation-job-dispatch.md`.

---

## 1. Concluded mindset shifts (locked unless overturned)

### 1.1 Distillation is translation, not curation

- Every non-empty semantic unit in source text becomes a thought (or updates an existing one). Phatic / low-signal content is **in scope**.
- Examples:
  - `"Hello?"` → `I asked Koa "Hello?"`
  - `"Still here - what's up?"` → `Koa said they're still here.` + `Koa asked "What's up?"`
  - `"What's the time?"` → `I asked Koa what the time is.`
- Later: optional AI/system dataset aggregation (e.g. "Conversational Fluff") as an **exclude filter**, not a distill-time drop.

### 1.2 Perspective is first-person singular

- User-authored source → thoughts use **"I"** (not "We").
- Agent-authored source → attribute Koa (`Koa said / asked / suggested / told me…`). Never restyle Koa's advice as the user's own conclusion unless the user endorsed it in user text.
- Prefer **"they"** for Koa over "it" (`Koa told me they do not have live access…`).
- Plural "we" only when the source is explicitly plural / collective (rare).

### 1.3 "Skip" is not a filter for weak content

- There is **no skip-thought tool**. Exit is only `complete` (no-op).
- Legitimate `complete` with zero new records:
  1. Chunk is empty of semantic content (whitespace / punctuation only) — still expand/check prior thought for update opportunity.
  2. Point already covered → `update-thought` (refine / add backlink), not silent drop; only skip re-`record` of an identical covered point.
- **Invalid:** skipping because the chunk is a test, greeting, question, or "low value".
- Current instruction that must be revised: lead-in/heading → `complete` with nothing; "benefit the user's life" as a gate (encourages curation).

### 1.4 Assistant framing

- Koa messages → thought is **our** memory of what Koa communicated (`Koa said/asked/suggested/did…`).
- Short non-conclusional / question chunks may keep the utterance **quoted inline**; longer material derives a conclusive first-person statement.

### 1.5 Keyword pipeline is a billable run

- Keyword generate / expand / strip costs + tokens must be recorded (own run under a job, or nested metrics on the indexing run). Not invisible side-work.

### 1.6 Hyphens / quality

- Soft instruction remains; optional hard detect + retry/correct pass later.
- Future: QC subagent / required step — **TODO**; prefer eliminating bad output at source via instructions + tests first.
- Future: AI regression suite with generalized examples — **TODO**.

### 1.7 Ops / runtime (non-schema)

- Prefer `Retry-After` (and OpenRouter rate-limit reset headers) over pure exponential backoff; exponential only as fallback / floor.
- Log filenames: **nanoid only** (timestamp stays inside JSON).
- CLI: no `--` with pnpm scripts (doc only).

### 1.8 Overwrite cascade

- Overwrite reindex must delete prior derived thoughts **and** orphaned tags/keywords with no remaining relations (verify cascade paths).

---

## 2. How "skip" works today (reference)

| Layer | Behavior |
|---|---|
| Tools | `complete` no-op ends the loop. No `skip-thought` tool. |
| Instructions (`instructions/agent.ts`) | "When nothing eligible remains… call complete"; lead-in/heading → complete with nothing; "benefit the user's life" guiding question. |
| `update-thought` | Refine / extend only — cannot delete. |
| Slice outcome | `"I want to test your memory. Who am I?"` → 0 thoughts — model treated it as non-eligible under the "benefit" / already-covered heuristics. **Wrong under new rules.** Expected: `I want to test Koa's memory.` + `I asked Koa "Who am I?"` (or update if prior overlap). |

---

## 3. Jobs / runs / polymorphic values — proposal (pending lock)

### Intent

Separate **billable work unit** (job) from **attempt** (run). Retries share one job, many runs. Inputs immutable on the job. Outputs live on runs (derive job dependents from runs).

### Proposed tables (v1 shape — names negotiable)

**`jobs`**
- `id` (nanoid)
- `kind` — e.g. `distillation` | `keyword-index` | `query` (extensible)
- `inputs` — jsonb array of typed input slots, ArkType-validated on read/write per `kind`
  - distillation example: `[{ type: "chat-message", id }, { type: "model-id", value }]` or equivalent
- `createdAt`
- no status, no updatedAt (inputs immutable; status = latest/relevant run)

**`runs`** (rename from `agent_runs`)
- `id`, `jobId`, `status` (`pending` | `running` | `succeeded` | `failed`)
- `batchId` nullable (reindex grouping)
- `error` nullable text
- `createdAt`, `updatedAt`, `startedAt`, `finishedAt`
- metrics **not** as opaque jsonb blob of everything — see below

**Metrics (pick one in Q&A)**
- **A.** Dedicated `run_metrics` rows: `(runId, key, valueText|valueNumeric)` with known keys (`input-tokens`, `output-tokens`, `total-tokens`, `cost-usd`, `step-count`, …)
- **B.** Narrow columns on `runs` for the universal set (tokens + cost) + optional jsonb `extraMetrics` for rare keys
- Recommendation: **A** if we expect keyword/query/distill to share the same meter surface; **B** if we want fewer joins for the POC

**Polymorphic values / relations (for inputs + outputs)**

Problem: jsonb arrays alone cannot reverse-lookup `thoughtId → job/run` in SQL efficiently.

Recommended v1 (pragmatic):

**`generic_values`**
- `id`, `kind` (arktype-discriminated: `model-id`, `cost-usd`, `token-count`, `chat-message-id`, `thought-id`, …)
- `value` jsonb (primitive or small object)
- optional unique index on `(kind, value)` for reusable constants (`model-id` + `"deepseek/..."`) — **only when kind is marked reusable**

**`generic_links`**
- `id`
- `ownerKind` + `ownerId` — e.g. `run` / `job`
- `slot` — `input` | `output` | `metric`
- `valueId` → `generic_values.id`
- indexes on `(ownerKind, ownerId, slot)`, `(valueId)` for reverse delete / "what produced this thought?"

Avoid putting every possible FK as a real column on the poly table. Integrity for high-value FKs (thought delete → link cleanup) can be app-level + scheduled sweep for POC; promote hot paths to typed join tables later if needed.

**Distillation composition**
- One **job** `kind=distillation` per message (inputs: message id, model id, flags).
- Runs: distill agent attempt(s); on success, child **job** `kind=keyword-index` per thought **or** same job with a second run phase — **open question**.
- Retry: new `runs` row on same job; do not orphan a failed run without linking the retry.

**Migration:** experimental DB only — TS/SQL wipe+push OK.

---

## 4. Keywords vs datasets — honest answer

**They are converging, but collapsing them now would be a mistake.**

| | Keywords (index layer) | Datasets (org layer) |
|---|---|---|
| Purpose | Recall / retrieval net | Human (or approved) structure |
| Volume | High, noisy OK if strip is good | Lower, intentional |
| UX | Mostly invisible | Visible, curated |
| Failure mode | Miss a thought in query | Wrong shelf / cluttered shelves |

**Keep a generated index layer** (whatever we name it) that is allowed to be broader than what the user would proudly pin as a Dataset. Without it, queries only hit what someone bothered to file — the infinite-memory demo dies.

**Where your instinct is right:**
- Multi-word dataset titles vs single-word tags are the same atoms if you always AND/OR consistently — prefer **single tokens** + composition at query time.
- Descriptions on ambiguous tokens (RAY / Ray / ray) are worth more than case-folding everything.
- Mass-suggested tokens that the user can **promote** into Datasets is the clean product story.

**Recommended direction (pending Q&A):**
1. Keep an under-the-hood index primitive (tags today; maybe rename later).
2. Preserve intentional casing on generate; store as given when name-cased.
3. Query default: case-insensitive gather → relevance pass with description/case disambiguation (sensitive-first alone will silently miss `ALTERED`).
4. Datasets remain the user-facing / policy grouping; optional "promote keyword → dataset" later.
5. Do **not** auto-assign every generated keyword as a Dataset — approval/validation gate or they become unusable clutter.

Open: whether index tokens gain a `description` now, or defer until query POC forces it.

---

## 5. Implementation waves (after Q&A)

### Wave A — critical, small (this correction loop)

1. Rewrite distill + chat-message instructions: translate-all; "I"; Koa "they"; quote-inline for short questions; kill benefit-gate / phatic-skip.
2. Keyword generate: prefer concrete nouns/distinctive terms; drop fluff (`what`, `said`, `user`); preserve name casing; stop blind `toLowerCase` if we lock case-preserve.
3. `Retry-After` / rate-limit reset in `with-rate-limit-retry`.
4. Log filename = run id nanoid.
5. Accumulate keyword-pipeline usage into recorded metrics (minimal path: extend current distill finalize **or** spawn index runs — depends on Q1).
6. Verify overwrite deletes tags with thoughts.
7. Re-run overwrite on first-10 window; iterate until slice looks right.

### Wave B — jobs/runs schema (after Q lock)

- Introduce `jobs` + `runs` + metrics/links as decided.
- Migrate off `agent_runs` columns (`conversationId`, `chatMessageId`, `thoughtId`, `resultThoughtIds`, flat token cols).
- Retry attaches to same job.

### Wave C — archive / later

- QC pass for hyphens / perspective.
- AI regression suite.
- Conversational Fluff dataset aggregation.
- Keyword descriptions + assignment-time disambiguation.
- Promote-keyword-to-dataset UX.
- `query-thoughts` unstub (dedupe-on-create).

---

## 6. Open questions

See chat — numbered Q1… — answers gate Wave B and parts of Wave A (metrics shape, casing, keyword-as-run).

---

## 7. Amendments log

- 2026-07-28: Initial correction sub-plan from slice-10 review + user corrections.
