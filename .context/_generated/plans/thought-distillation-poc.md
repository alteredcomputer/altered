# Thought Distillation — Master Plan (POC v1)

Status: **approved direction, ready for implementation**.

Companion plan: `memory-query-poc.md` — separate but co-dependent. This plan owns the shared schema (thoughts, datasets, attributes, tags, agent_runs) and the shared keyword-generation codepath; the query plan consumes both.

Grounding sources (for future context loading): Apple Notes 2026-06-22 ("Distill Thoughts tool" + "Memory Injection Placement & Agent Authority"), 2026-06-28 ("Something else about the distillation process" — subjective content handling), 2026-06-17 (summarized indices — deferred), 2026-05-30 (keyword expansion strategy), 2026-05-13 (original query/distill algorithm sketch); Koa chat 2026-06-23 (script-first execution directive) and 2026-06-29; planning chat 2026-07-05 → 2026-07-15.

---

## 1. Objective

Auto-transform source text into individual, AI-authored, keyword-indexed thoughts — backlinked to immutable sources — so the user gets a ~90% accurate, usable ALTERED brain with **zero manual work**. The end goal (ultimate control of your psychic entropy) is for the user to manually review every derived thought and its source, rework it to their liking, and validate/approve it — the most strenuous task in ALTERED. Until they do that for everything, the auto-distilled brain is the usable 90% baseline. This phase builds only the auto path.

How this appears in the app: the auto-distillation process splits a raw thought (a Cursor chat imported as source, a long voice note, a chat message) into many individual, AI-authored (attributed/labelled), indexed thoughts carrying both user-land **Datasets** and system-generated **tags**.

Corpus order:

1. **Koa iMessage `chat_messages`** (100+ rows, includes very long messages) — the tuning corpus. Fine-tune the whole process here until ~80% satisfactory.
2. **Apple Notes markdown exports** — bulk upload near the end of the POC via a minimalist utility (section 8).
3. **Cursor chats** — explicitly out of scope; different beast, handled by a future Search Files flow (section 10).

## 2. Timebox & posture

3–7 days alongside the 9–5. Governing mindset: any sub-problem that could eat days of validation (e.g., the history exclusion window) ships as its simplest form — a one-to-five-line check — with the full design preserved as a `@todo`. Everything non-critical is reduced and minimized. No compromise on the quality of what does ship: every line is human-reviewed; the product is a representation of real quality. Cost metrics are an accessory, not a main actor — but still 100% necessary.

## 3. Success criteria

- **Primary (v1):** manual review of results at each stage of the process — positional references, sentence conciseness and clarity, keyword sanity — confirming it is done to the standard of how Riley would do it by hand on paper.
- **Deferred (laborious, later):** a benchmark base — hand-distill the first ~20 chat conversation messages ourselves, then diff programmatic output against the human base and work backward from mismatches.

## 4. Conceptual model: raw thoughts and source text

This section records the conceptual decision behind source storage; it drives the schema.

- Imported source text (Apple Notes, voice-note transcripts, pasted chunks) is **not a file**. Whether extracted from Notion or imported raw, its intrinsic type is a large, long chunk of ideas — a **"raw" thought**: straight out of the brain, raw entropy, where every thought starts as text. It is stored **as a thought**, in the thought content field, with a special grade/type/state.
- Raw thoughts are **not meant to be edited/updated**, and are ultimately **temporary**: they exist to be broken down, are extensively supported (indexed, backlinked) until deleted, and deletion happens when all thoughts have been manually resolved from the source text and the user approves deletion.
- Rationale: the "ideal" brain contains only maintained (organized/refined-toward-perfection) thought structures and associated files; anything outside that should be removable (with exceptions like version history, itself periodically prunable unless explicitly kept).
- The grade may be a column on the thoughts table or a reserved system attribute relation — column for now. This forces a future rethink of what "draft" means (currently: a thought missing alias and/or content) alongside validated/invalidated, and where each concept lands in code. **That rethink is explicitly deferred — not worth stressing over now.**
- **Chat messages are the exception:** to avoid duplication they are NOT copied into raw thoughts. They are referenced polymorphically as source (section 5) and resolved through an app-level adapter.

## 5. Data model

Fresh and minimal, design cues from `altered-again` (`thoughts`, `datasets`, `brains`, `thought_metadata` tables) but without the deprecated `kind` discriminator baggage. The Thought data model and its variations get brought over **reconsidered** under the raw-thought concept above.

File placement: `src/models/<entity>/storage/schema.ts` style inside `@altered/server-experimental`. Do **not** group tables under `storage/database/memory/` — in the storage folder, "database" contains per-table folders or non-table database code, and many tables (e.g., messages) already live under their own topic folders. The overall file structure is still a work in progress; keep entities separable. Extend the **current Neon database/schema** — no separate namespace.

### Tables

- **thoughts**
  - `id` — nanoid (default alphabet, 21 chars).
  - `brainId` — nullable until auth lands. One brain per phone number conceptually. No separate system brain — a flag column instead. Note: brainId will eventually shift to a dynamic dataset relation and this column may disappear; keep it for now, migrate later.
  - `alias` — nullable. Alias-less thoughts allowed initially; an alias-generation pass can come later.
  - `content` — the thought text (also holds full source text for raw thoughts).
  - grade/type column — discriminates `raw` vs derived/manual (naming provisional; see section 4 deferral).
  - AI-authorship attribution flag — derived thoughts need labelling as AI-authored.
  - system flag column — replaces a separate system brain.
  - `createdAt` / `updatedAt`, plus original created/modified timestamps for imported sources.
- **datasets** + **thoughts_to_datasets** — user-land structures, represented per the product model (datasets are themselves thought-like tags).
  - One **reserved system dataset `derived`**. Every derived thought receives it. The dataset assignment *is* the source-link contract: **removing the dataset removes the link to the source and all associated attributes.**
  - Attribute-schema association is **name-based only** for now — no literal schema enforcement. Conceptually: the dataset has N associated attribute IDs; a thought holding the dataset without those attributes is invalid / a "draft" (term to be renamed if unfit). Enforcement comes later.
- **attributes** — stub of the future scalable-thought-columns table (user/schema KV). **Not** used for source backlinks — see `backlinks` + §15.
- **backlinks** — dedicated system table for derived-thought source spans (indexed overlap / by-source lookup). One logical backlink = `groupId`; parts are rows. Supersedes the earlier "store backlinks as attributes" stub (see §15 for the constraint and rejected alternatives).
- **tags** — the keyword table, associated to thoughts. Thought-scoped, never source-scoped (rationale in section 7).
- **agent_runs** — one shared table for BOTH distillation and query runs. Naming rationale: "runs" alone is ambiguous; "agent_runs" clearly means AI-agent executions, storing statistics/metrics about generations, not the generations themselves. Fields: type discriminator, model, token/cost stats, status, timestamps, and relations to whatever the cost is associated with (conversation, thought, source) — polymorphic column or multi-column relations, whichever is simplest; app-level relation discernment is fine. Requirements: duplicated re-distill outputs tie to a run id so they can be filtered, reviewed/compared, and deleted; batched runs (reindex) must be distinguishable from single-message runs.

### Source-change propagation

Derived thoughts are a special type that is **immutable** — they can only be deleted, and deleting unlinks everything. Since raw sources are also not meant to change, the "what happens to derived thoughts when the raw thought changes" problem is dissolved by construction. Re-distillation (section 7) covers regeneration needs.

## 6. Distillation algorithm ("human on a piece of paper")

The design question throughout: how would a human do this by hand? The v1 skeleton from earlier drafts was slightly overblown for POC but right-shaped for a durable algorithm; this is the corrected version.

### 6.1 Chunking

- Split the source into **sentences** (if properly splittable); fallback to a character/word cutoff at average sentence length when sentence splitting fails.
- Chunks are processed **sequentially** — that's how humans read. (An earlier idea was parallel async background jobs per chunk; explicitly rejected for source-text chunks.)

### 6.2 Per-chunk agent loop

Runs in the **distillation subagent** (`ai/agents/chat/subagents/distillation/`), never the main chat agent. Rationale (2026-06-22 note): instructions mostly differ, and context must NOT be the whole chat — each chunk starts from **absolutely zero context**, then expands only with what the loop gathers.

1. **Gather context.** The agent must understand the target text before working with it.
   - Primary tool: **directional expansion** — request ± X characters, words, or sentence-chunks before/after the target. Navigating directionally to search for surrounding context is the most accurate, context-efficient strategy compared to summarizing or AI-searching the entire source text.
   - Alternate tool: **programmatic text search within the source** for a set of words that may sit in far-away chunks — more efficient than repeated chunk expansion, especially when the context isn't expected to be nearby.
   - Deferred, noted for later: (a) final-resort full-source load into context; (b) if subtext meaning still can't be inferred, chronological search of external thoughts created before/after the source; (c) if the agent knows what the subtext means but needs external ideas (e.g., how ALTERED's distillation works — the business concept, not the capitalized word), allow it to query the thought database.
2. **Rewrite.** Using all gathered context, write the most precise yet natural definition of the **first point/concept in the chunk**. Future: stylized to the user's preferences or trained style. This is the extracted thought content.
3. **Positional reference.** With the same context group, decide what positional span best represents the thought — directly or indirectly — within the source. This position **may overlap** other extractions; that's fine. Refs may extend into before/after chunks **only known ones** (expanded/adjacent), never far-away searched chunks across an unknown gap — and only as long as the main point of the target idea lives in the current chunk.
4. **More points?** With the same context (now including the derived thought), decide whether the original chunk contains additional points to distill. If yes, repeat steps 2–3 **within the same agent**, retaining all previous context — for points within the same sentence/chunk it will almost always be useful. Repeat until the chunk is deemed complete.
5. **Advance.** Move to the next chunk and **drop context to zero** by default. Exceptions and mitigations:
   - If the previous chunk was a length-based cutoff (not a real sentence), a core concept may straddle the boundary. Implicit/indirect statements ("Yeah, I want that.") also require before/after knowledge. This is very subjective — **marked for a later strategy discussion with AI**.
   - Mitigation: an **offered (not auto-called)** tool that retrieves the derived thought(s) from the previous chunk — or ahead chunks — with their positional references. Since both chunks and derived thoughts carry positional references, the association is implicit. This takes precedence over raw before/after chunk traversal.
   - **The step-5 catch:** if the first concept in the current chunk was already fully distilled by the previous chunk's forward expansion (it got "after" context and derived the thought), the agent must **explicitly call this out** — via a status-update tool call, completion-milestone tool call, or similar — stating the first target (or several following targets, if multiple were already 100% distilled in prior known context) is done, then move on.

Step 5 repeats until derived thoughts cover the entirety of the source text.

### 6.3 Keyword indexing

Foundational principle (settled after deliberation): **keywords are explicitly about the derived thought row itself.** Surrounding source context would be unknown pollution — the thought detaches from its source over time — even though it would help indexing relevance. Keywords exist for **searchability/findability beyond datasets**; they are NOT for structure or relations — datasets do linking, structuring, and topical association. Keywords must not rely on the source text.

**Form (corrected 2026-07-26):** each keyword is **exactly one word**. No phrases / multi-word compounds with spaces. Hyphenated tokens count as one word. Normalization drops anything with whitespace.

Timing: either simultaneously during each chunk (leverages in-memory context) or afterwards per derived thought as an independent job. **Default: independent job per thought**; per-chunk inlining is a later option.

Steps:

0. **Pre-generation context:** a limited search using the **query tool** (Plan B) to gather brain-side info about the thought being indexed — run in a **subagent**, with results **summarized** before loading back to reduce context. Critical constraint: generated keywords must relate **only to the thought, NOT the summary** — double down on this in the relevance pass. (External searching here can resolve things like "ALTERED" as a business rather than a capitalized word.) Stub this step until Plan B lands.
1. **Direct keyword generation** for the thought.
2. **Synonym expansion** — the existing `expandKeywordGeneration.iterations` option, default 1 iteration. (Per the 2026-05-30 note: expansion ~10x's surface area; a second expansion introduces drift — don't.)
3. **Relevance strip** — drop expanded keywords without direct relevance to the thought (e.g. pets → kibble drift). This keeps indexing surface area high without introducing irrelevant retrieval.

The keyword strategy stays **basic** for now — no added nuance unless a need emerges. The generation codepath is **shared with query-side keyword inference** (symmetry; divergences documented in `memory-query-poc.md`).

Notes:

- Surrounding brain context will change and evolve as thoughts accumulate — we can always **re-index**, and even **re-distill** (helpful for really vague source text needing more context), though re-distilling will be rare. Noted, not built.
- `@todo` P3: optimize keyword accuracy by factoring in / comparing against global keyword rankings (Google keywords or a dictionary tool).

### 6.4 Auto-dataset creation & assignment (future — recorded, not built)

Separate from distillation and indexing. AI-authored dataset creation/assignment, driven by **different factors than keywords**: sibling/very-similar thoughts found via cross-keyword searches, and/or existing applicable datasets. These factors assign existing datasets or **conservatively** design new ones to group/structure thoughts desirably. Possibly extended to require an actual **intent**: why group marketing ideas you'll never use? Why file a Makeup thought into a Cosmetics dataset if you're a guy? Intent-discovery could be part of generation — generate grouping ideas, then search the brain for a usage intent; without one, the grouping is by definition pointless. Useful later depending on how datasets serve structure/relations in ways keywords can't; not needed immediately.

## 7. Integration & runtime behavior

### Trigger

- Distill **every saved message**: user messages, assistant messages, perceived commands, short and long alike. Rationale: everything in the conversation is a fact we consumed and accepted as truth or rebutted, and memorized — the memory layer should mirror that. Assistant messages matter so we remember what the assistant generates.
- **Async background job** (leaning). Trade-off recorded: async lets the chat agent instance continue quicker, but a slow distillation could be missed by an immediately-following query — mitigated by the retained-history rule ("keep X messages/X duration back, omit those sources from the query, and query distilled thoughts only for prior messages"), which gives the job more than enough runway. Sync remains acceptable if simpler to ship first.

### Failure handling

Async delegation means we always still respond. Worst case for an unhandled failed job: the message eventually exits the exclusion window with no distilled thoughts — a context gap, acceptable for POC. Add retry logic only if trivial; otherwise let it fail, spot it in logs, and re-trigger by run id via a pnpm command later.

### Tool output

Less is more for returned context. The earlier `thoughtCount`/`cost` output schema was placeholder; v1 returns essentially **`success` boolean + a message**. Thought payloads are never returned through the tool — they're loaded independently via querying. Stats are derivable from `agent_runs`.

### Idempotency & re-distillation

- All-new inputs → proceed.
- Any already-distilled inputs → when run from a UI (Raycast), return a **confirmation prompt** first.
- Overwrite vs duplicate is an open question. **For prototyping: duplicate**, with every output tied to its run id so runs can be filtered, compared, and bulk-deleted. Refine later; the only hard requirement is that batched (reindex) runs stay distinguishable.

### Message persistence refactor (prerequisite/parallel work)

Full reasoning recorded because it changes the chat data model:

- **Reasoning tokens:** everything excessively reasoned before a conclusion is unrefined entropy; the response is that thinking's most concise form, ± tiny context loss. The purpose of thinking is to derive the conclusion, not to remember everything thought — so **do not store reasoning tokens or any intermediary tokens**. If "why we concluded X" ever matters, that's an external optimization (e.g., a tool call that saves in-depth reasons) layered on later.
- **Tool calls/results:** during the run the agent sees them live; once persisted they're conversational noise. Query results, distilled-thought counts, etc. are always derivable as statistics from the DB primitives themselves. **Strip all tool calls and tool results before saving.**
- **What survives:** only the meaningful text messages actually sent — status updates ("thinking…", "found X, digging further…") and the final response — saved as **separate message rows**, one plain-text content each (the jsonb column stays but holds plain text per row). Semantically separate entries beat a multi-part JSON blob, even if that departs from the OpenAI message spec — the stripping already does. Philosophy: the DB should best represent the iMessage conversation (which also serves the multi-bubble/timing plans), not the source generation — full traces are always retrievable from OpenRouter (generation IDs) on the developer side, and could be exposed to users much later.
- Accepted caveat (evaluated, no strong counter-argument found): losing tool records means no mid-loop resume from DB and no strict provider-format replay — neither is needed, since context is rebuilt from text rows every turn.

### Reindex conversation

A **pnpm script**, not an agent tool (an agent-tool variant can come later). One argument: `skip` (messages already distilled) | `overwrite` | `duplicate`. Required because starting fresh from incoming messages only would miss the 100+ existing messages — we must be able to trigger an index of the entire thread.

### Scratchpad implementation file

`scripts/tmp-distill-poc.ts` — the entire pipeline in one file (importing agents etc., recreating within the file rather than pre-integrating), to avoid the time overhead of refining into infra prematurely. Constraints: it is **DB-backed and online** — maintains the database-based consistent architecture, not an offline/local run — and is a scratchpad to be refactored into infra later. It may persist as the **batch-distill entrypoint**: takes a list of IDs (copied from the database) and batch-distills them. The eventual production trigger path is the incoming Raycast internal-experimental admin extension (file-upload form + an ID-list batch-distill form command); local pnpm-script ingest of notes was explicitly dropped in favor of that, with the interim utility below.

## 8. Apple Notes upload utility (near end of POC)

After the chat-message corpus is tuned to ~80%: a minimalist utility uploading a **nested directory of markdown files** → raw thoughts, storing modified + created dates, original title, content, potentially the file path (value uncertain), and the upload date. Keep file metadata minimal.

`@todo`: dedupe — hash the properties+content, check for the hash before insert, and warn "already uploaded — upload anyway or cancel?". Not a priority; DB-level dedupe (search, compare, delete duplicates) is always possible after the fact.

## 9. Models, cost & observability

- **`anthropic/claude-sonnet-4.6` for every step** — model consistency valued over savings at this stage; it's also what the chat runs on. Watch the cost metrics breakdown.
- Build a **per-step model map** (split / rewrite / keywords / relevance / …). Baseline for non-chat steps is now `DEFAULT_WORKER_MODEL_ID` (`deepseek/deepseek-v4-flash`); raise only when a step needs high intelligence. Admin command classification may still use `openai/gpt-5.4-nano`.
- AI SDK notes: the model can be swapped mid-agent (same instructions/context), per tool, and per step — separate agents just configure their own.
- **No cost caps or kill switches** — the OpenRouter dashboard limit governs prototyping.
- Metrics: **new tables** (`agent_runs` + relations), plus console logging. **No user-visible stats** — a dashboard or Raycast command comes much later.

## 10. Deferred / out of scope

- **Cursor chats — future Search Files flow.** Cursor chats are a totally different beast (code content, long contradicting threads where early decisions evolve/expand/contradict/die, massive context). Do NOT index them like notes. Future design (recorded, detail intentionally light): upload chats as files to file storage (blob-style service, e.g. UploadThing-like; probably better than DB text), referenced in a DB table; a **Search Files** tool — possibly its own subagent — greps them (inspiration: Vercel's grep site, grep.app-style) returning only exact matching text content, optionally with a summarization step reducing results to detailed conclusions (like reasoning tokens) before returning to the main chat. Results are stripped from saved history exactly like query results — repeated searches are far cheaper than persisted inference tokens, even re-searching on later turns. A **pnpm parity script** exposes the same search so remote Cursor agent instances can query the cloud-stored chats (note it in AGENTS.md when built). Distillation may consolidate onto Cursor chats much later.
- The subjective-content stance (2026-06-28 note) stands and needs no extra machinery: distill and index **everything**, including vague/contradicting/unsolidified voice-note ramble — resurfacing similar or contradicting thoughts is the point; correction is the human's job in the future clarity system. **No certainty scoring** now — a distilled conclusion is what it is.
- Compression tiers: **single tier** until the POC defines the axes of variability (the low/med/high idea with per-tier examples is recorded in the 2026-05-30 note).
- Hyper-summarized topic indices w/ invalidation hashing (2026-06-17 note), vector store, clarity/merge/archive tooling, auto-datasets (section 6.4), Super Memory shortcut, alias-generation pass, benchmark harness (section 3), draft/validated/raw semantics redesign (section 4), indexing-version persistence & git-artifact re-run strategy (2026-05-30 note).
- **Named next step after both plans are complete and tested to satisfaction:** a structured-thinking prototype — datasets layered onto refactored thoughts to create precise, trackable structures (e.g., the marketing plan) — with an interface to interact with it, likely a Raycast extension. Beneficial during the marketing campaign; can be done manually in notes/a repo in the interim.

## 11. Execution phases

1. **Schema + models** — thoughts, datasets, thoughts_to_datasets, attributes stub, tags, agent_runs, under `src/models/<entity>/storage/`; `pnpm db:push`.
2. **Chunker + context tools** — sentence split with length fallback, directional expansion, in-source text search; pure functions, script-tested in isolation.
3. **Distillation subagent + per-chunk loop** inside `scripts/tmp-distill-poc.ts`; run against real Koa messages; manual review of thoughts + positional refs.
4. **Keyword job** — generate → expand → strip; brain-query context step stubbed until Plan B phase 2; manual review of tags.
5. **Save-path integration** — message-persistence stripping refactor + on-save distill trigger (async job).
6. **Reindex-conversation script** — backfill the full Koa thread; validates batch mode + run distinguishability.
7. **Apple Notes upload utility** + bulk distillation run over the exports.

Dev workflow at every phase: scripts to test individual components → larger manually-triggered runs → only then promote functionality into the main chat agent's tool capabilities.

## 12. Amendments — 2026-07-20 (first live-run review; supersedes conflicting points above)

Agent loop & tools:

- `toolChoice: "required"` with a no-op `complete` tool (no execute body) as the only loop exit — no free-text summarization step; `result.text` is irrelevant. `stopWhen` (25 steps) is a catastrophic-cost guard only.
- `alreadyCovered` is removed. Covered points are simply skipped (call `complete`); near-duplicates go through `update-thought`.
- Update-vs-new rules: update only for a literal duplication, refinement, or slight extension of the same single concept ("I like hot dogs" → "I like hot dogs very much"). Compound/adjacent concepts ("I like soda with my hot dogs", "I like big hot dogs") and contradictions are always new thoughts. Never merge before user approval outside these cases.
- `record-thought` takes verbatim **excerpts** instead of numeric start/end (AI-arithmetic reliability). The system validates containment (error → agent retries) and converts each excerpt to a positional span. Multiple excerpts per thought skip non-correlating middle words and may cross chunk/source boundaries; spans should be fine-grained and cover every piece of text that shaped the thought, including text pulled from earlier sources.
- `update-thought` (by index) updates content and/or appends excerpts. Expansion/search results include previously distilled thoughts overlapping the returned ranges, each with an index mapped internally to the real identity.
- `query-thoughts` is a forced step-0 stub (returns nothing) until Plan B lands; then it loads existing brain thoughts so dedupe happens at creation (update existing thought with a new backlink instead of duplicating).
- Debug `thinking` property (short "why") on record/update, wired as a tool-constructor flag through `createDistillationAgent({ debug: { thinking } })`; conditionally excluded in production to save tokens.

Backlinks & data model:

- Thoughts carry an **array of spans** (polymorphic multi-source backlinks): `{ sourceIndex, start, end, excerpt, author }` in memory; DB rows follow the same shape (a discriminator supports concatenated cross-message spans for SMS-split sentences — cheaper to revert than to merge later).
- Each backlink stores `author` (`user` | `agent` enum — "agent", not "assistant"). Future queries can exclude agent-derived thoughts (`experimental_generated_messages`-style flag in the iMessage implementation).

Previous-source expansion:

- `expand-context` auto-fetches the previous source **under the hood** when expanding before position 0 (agent never asks for it explicitly): generic `fetchPreviousSource` callback per source type (chat messages: previous message in the conversation; notes later: previous by created-at). Fetched sources are chunked, memoized in context, and indexed **negatively** (0 = current, -1 = previous); chunk indexes stay per-source so nothing shifts.
- If nothing earlier exists, the response says so and the agent generalizes the unresolved referent (e.g. "a visualization session") instead of inventing specifics.
- `@todo P3`: deeper history than one source back.

Chunker:

- Line breaks are sentence delimiters (in addition to `.!?` + closing punctuation, now including markdown closers `* _ \` ~` so `**...made.**` splits correctly).
- Inter-chunk whitespace is **prepended to the following chunk** (whitespace implies structure for what follows); trailing whitespace is appended to the last chunk. Source text is never manipulated — chunks concatenate back to the exact source.

Instructions & perspective:

- One concept per thought, simplest self-contained sentence; guiding question: "What conclusion can be taken from this that will benefit the user's life?"; keep just enough referenced detail (resolve "it"/"that" from context) — neither over-generalized nor copied filler.
- Chunk-scoped discipline: never distill ahead into later chunks (each gets its own run); gather context sparingly; don't retry failed searches with variations.
- Perspective (chat-specific instruction extension, not baked into the generic agent): user-authored text → "We should …" default (`@todo P2`: experiment with "I"); agent-authored text → attribute Koa in the content ("Koa said/told me/thinks …"), even for plain facts. Wired via `instructions.extensions` + per-source `author` in context.
- Personal language-style preferences (hyphens over all dash-style characters) injected into distillation instructions from `src/ai/instructions/user-language-style.ts`; `@todo P2`: inject into the chat persona too.

Script (`tmp-distill-poc.ts`):

- Defaults to the **first user-role message** with `userId IS NULL` (assistant messages still indexed later); `--message-id` override.
- Experimental message split: chunk metadata as a `system` message (`allowSystemInMessages: true`), the **verbatim chunk text alone** as the `user` message — disambiguates offsets/line breaks.
- Logs per-step tool calls (condensed inputs) + tool errors + running thought list.

Known bug (separate fix): the ephemeral timestamp header (`[Wednesday, 2026-06-24, 15:30]`) leaks into saved assistant message content — fix in the ephemeral-metadata prompt path, not here. (The 2026-07-26 runs no longer show it only because the affected rows were edited directly in the database; the bug itself is untouched.)

## 13. Amendments — 2026-07-26 (cost pass + structure cleanup; supersedes conflicting points above)

Models (supersedes §9's "4.6 for every step"):

- `anthropic/claude-sonnet-4.6` is **removed** from the model config; every prior usage (chat agent, iMessage response builder, both scripts) now runs `anthropic/claude-sonnet-5` — newer and cheaper ($2/$10 vs $3/$15).
- Distillation initially defaulted to **`openai/gpt-5.6-luna`** ($1/$6). Measured: **$0.0224 for 5 chunks (~$0.0045/chunk)**. Superseded by §14.
- `xiaomi/mimo-v2.5-pro` ($0.348/$0.696) was **tested — it fails this workload**: malformed tool-call JSON (truncated strings), no loop termination, 45 duplicate thoughts. Kept for later mechanical-step benchmarks. Non-pro `xiaomi/mimo-v2.5` ($0.105/$0.28) is also in config, untested on this loop.
- `deepseek/deepseek-v4-flash` OpenRouter list price is **$0.09/$0.18** (was incorrectly noted as $0.14/$0.28).

Backlinks (supersedes §12's span shape):

- Spans are now **backlinks**: `{ kind: "single" | "continuous", parts: [{ sourceIndex, start, end }] }`. `continuous` means the parts form **one uninterrupted excerpt split only by a source boundary** — it must never render as several separate references. This is the concatenated-backlink case (SMS-split sentences).
- **`excerpt` is no longer stored.** Excerpts are an agent tool input only; the system normalizes them to positions. Text is always re-derived from positions (`source/read-backlink.ts`) for logs and UI.
- **`author` is no longer on the backlink.** Authorship gets its own table, and source dates belong to the source — copies on the backlink row would only rot. Instead `ResolvedBacklink` / `ResolvedBacklinkSource` (`backlinks.ts`) is an **app-level aggregate type** carrying `author`, `createdAt`, `updatedAt`, and `addedAt` (when the source entered ALTERED, distinct from when it was authored), resolved by 1–2 follow-up queries when a thought is read alongside its sources. Query-side agent-source filtering (§`memory-query-poc.md`) works off that join, not a denormalized column.
- Backlink types are staged in the distillation folder with a `@todo P1` to relocate into `src/models/thoughts/` once the schema lands.

Cross-boundary excerpt matching:

- Excerpt lookup runs against **every loaded source concatenated into one document** (`source/document.ts`), so an excerpt may span chunks and source boundaries. A boundary-crossing match resolves to one `continuous` backlink with the separator excluded; a same-source match stays `single`.
- Matching falls back to a **whitespace-normalized** pass when the exact string misses, covering the agent re-spacing text while joining across a boundary.
- Instructions now state that a single excerpt may run across chunks and sources as concatenated text, and that continuous text is one reference — separate excerpts are only for text that is genuinely apart.

Agent loop:

- `complete` takes **no arguments**. Both the original `summary?` and the replacement `error?: { message, cause? }` were fabricated on *every* call — the model invented failure narratives ("the completion call was interrupted…") on successful chunks. Failures are read from tool errors and the step guard instead; `@todo P2` to retry error reporting behind a required outcome discriminator once the loop is stable.
- `record-thought` silently returns the existing index when content exactly matches an already-collected thought — a cheap guard against the duplicate-loop failure mode seen on MiMo.
- Instruction tightening from the live runs: a second statement about the same subject is a new thought unless it only sharpens the first (when in doubt, record separately); never join two statements with "and"/"but" to fit one thought; when adding excerpts to an existing thought, cover only the new text.

Arktype convention:

- Union properties must pass `"union"` as the second `describe()` argument (as in `tools/admin/change-model.ts`). Without it arktype emits the description on every branch **and** the union, bloating every tool schema. Verified: `direction`/`unit` now emit a single `enum` + one description.

Structure (files were bloated; split by topic):

- `distillation/backlinks.ts` — backlink kinds, parts, schemas, resolved aggregate types.
- `distillation/context.ts` — agent context schemas only (chunk schema imported, no longer duplicated).
- `distillation/instructions/` — `agent.ts` (base), `thinking.ts` (debug), `chat-messages.ts` (Koa perspective extension, moved out of the scratchpad script).
- `distillation/source/` — `split.ts`, `expand.ts`, `search.ts`, `document.ts`, `locate-excerpt.ts`, `read-backlink.ts`, `previous.ts` (`FetchPreviousSource` + `ensurePreviousSource`).
- `distillation/tools/` — `set.ts` plus one file per tool, with `options.ts` (tool options + thinking property), `context.ts` (context accessors), `excerpts.ts` (excerpt → backlink normalization), `overlaps.ts` (`TextSegment` + overlap lookup).

Run logging:

- Runs write a full trace to `.logs/agents/<agentId>/runs/<timestamp>.json` via the shared `src/ai/observability/write-run-log.ts` (`run-agent.ts` refactored onto it). The trace holds sources, per-chunk steps with tool calls/results/errors, resolved thoughts with backlink text, and cost. Console output is reduced to the chunk text, tool-call names with condensed inputs, newly recorded thoughts, and a final cost + log path line. `@todo P2` to replace with the `agent_runs` table, keeping files as the raw trace.

Open TODOs recorded in code:

- `@todo P2` benchmark the "never distill ahead" rule against forward-expansion coverage — it trades duplicate work for missed cross-chunk conclusions and the balance is unverified.
- `@todo P2` live-test `fetchPreviousSource` against a conversation where the referent only resolves two or more sources back (currently only one-source-back is exercised).
- `@todo P1` on `to-model-messages.ts`: ephemeral timestamp header still leaks into persisted assistant content — audit the save / message-mirroring path (DB rows were hand-edited; the bug remains).
- Test corpus: pick a better multi-thought message (~5 chunks) as the standing regression case once the model choice is locked and persistence lands.

## 14. Amendments — 2026-07-26 (cheap-model ladder; supersedes §13 model default)

Ladder order tested / reserved:

1. **`deepseek/deepseek-v4-flash`** ($0.09/$0.18 list; DeepInfra FP4 often cheaper with cache) — **adopted as default**. Three live runs on `SPHoc7rk6RMmuldo5W-8y` (5 chunks): **$0.0031–$0.0034 total (~$0.00066/chunk)**, ~7× cheaper than Luna, 0 catastrophic failures. Occasional excerpt miss is retried successfully. Output quality close enough for POC.
2. `openai/gpt-oss-120b` ($0.03/$0.18) — added to config; **not needed** once DeepSeek held.
3. `google/gemini-2.5-flash-lite` ($0.10/$0.40) — added; reserved fallback.
4. `google/gemini-3.1-flash-lite` ($0.25/$1.50) — already in config; reserved fallback.
5. `xiaomi/mimo-v2.5` / `xiaomi/mimo-v2.5-pro` — keep for later; Pro already known-bad on forced tool loops.

Provider lock:

- All DeepSeek model IDs route through OpenRouter with `provider.only: ["deepinfra"]` + `provider.quantizations: ["fp4"]` (`create-chat-model-options.ts`) — cost + cache locality, not a quality gate.

Instruction stabilizers added with the DeepSeek swap (keep for regression context):

- Skip lead-ins / headings / "about to say…" announcements — call `complete` immediately with nothing recorded; do not expand forward just to discover what the lead-in introduces.
- No gloss elaborations ("meaning we should…", "rather than…") — state the conclusion itself in one short sentence.
- Prefer short verbatim excerpts; never paste a long multi-sentence excerpt when a few words locate the span.
- `update-thought` cannot remove a thought — mistaken lead-in records must be left alone and `complete`d.
- Style pref: single ASCII hyphen only (no em/en/`--`).

Remaining flake (explicit TODOs):

- `@todo P2` on `instructions/agent.ts`: lead-in / heading chunks (e.g. `Here's the sharp take:`) still intermittently record a meta-thought instead of skipping. Observed across the three DeepSeek runs (run 2 skipped cleanly; runs 1 and 3 recorded). Re-tune the skip rule and/or add a structural heuristic once a standing ~5-chunk regression corpus exists.
- `@todo P2` (paired): decide whether mistaken lead-in thoughts should be deletable in-loop (today: no — `update-thought` is refine-only) or filtered post-hoc before persistence.

`createDistillationAgent` default is now `deepseek/deepseek-v4-flash`; `--model` still overrides.

## 15. Amendments — 2026-07-26 (persistence encoding)

### Constraint: attributes cannot host multi-span backlinks cleanly

Original stub stored source links as attribute keys `source` / `source-start-position` / `source-end-position`. That fails under `unique(thoughtId, key)`: at most one value per key per thought, so multi-span thoughts and `continuous` cross-source parts cannot be represented.

Attribute-layer options considered and **rejected** for the system path:

| Approach | Why not |
|---|---|
| Drop uniqueness + add group/index columns on attributes | Attributes stay a generic KV bag; range/overlap queries stay awkward |
| Indexed keys (`source:0`, …) | Awkward naming; still no native span search |
| One JSON `backlinks` blob attribute | Fine for writes; kills indexed by-source / overlap lookups |

### Chosen: dedicated `backlinks` table

- Table: `models/backlinks/storage/schema.ts` — system-level, indexed.
- One logical backlink = one `groupId`; each part is a row (`kind`, `partIndex`, `sourceType`, `sourceId`, `start`, `end`).
- `continuous` parts share `groupId` and must never render as separate references.
- Indexes: `thoughtId`, `groupId`, `(sourceType, sourceId)`, `(sourceType, sourceId, start, end)` for future overlap queries (dedupe-on-create, query filtering).
- App shape + flatten helper: `models/thoughts/persisted-backlinks.ts` (`toBacklinkInsertValues`).
- `saveDerivedThought` writes thought + `derived` dataset membership + backlink rows in one transaction.
- Reserved system dataset id+alias `derived` via `getOrCreateDerivedDataset` (stable id avoids NULL-`brainId` unique-index duplicates).

Open TODOs:

- `@todo P1`: cascade-delete backlink rows when `derived` dataset membership is removed.
- `@todo P2`: wire `agentRunId` into `saveDerivedThought` / `resultThoughtIds`.
- Not yet wired: `tmp-distill-poc` → save path, keyword job.

## 16. Amendments — 2026-07-26 (script → DB wire)

- `tmp-distill-poc --persist` starts an `agent_runs` row (`type: distillation`, `status: running`), saves each collected thought via `saveDerivedThought`, then completes the run with cost/tokens/`resultThoughtIds` (or `failed` + error on throw). Default remains log-only.
- Run-local `sourceIndex` backlinks convert through `toPersistedBacklinks` (chat-message ids) before insert.
- File traces under `.logs/agents/distillation/runs/` still written; they now include `agentRunId` + `persistedThoughtIds` when persisting.

## 17. Amendments — 2026-07-26 (keyword pipeline)

- Shared module `ai/memory/keywords/pipeline.ts`: generate → expand (default 1 iter) → strip expanded-only. Brain-context pre-search (step 0) remains stubbed until Plan B.
- Default keyword model: `deepseek/deepseek-v4-flash` via shared `DEFAULT_WORKER_MODEL_ID` (`ai/models/defaults.ts`) — same default for all non-chat agents / mechanical jobs unless a step needs high intelligence (chat stays on Claude).
- Keywords are **single words only** (no phrases); pipeline normalization drops whitespace-containing tokens.
- Structured output uses `generateText` + `Output.object` (not deprecated `generateObject`).
- `indexThoughtKeywords` + `replaceTagsForThought` write the `tags` table.
- `tmp-distill-poc --persist --index` runs the pipeline on each saved thought. Query-side should skip strip (`@todo P2` explicit `mode`).

## 18. Amendments — 2026-07-26 (worker model default + keyword form)

- Introduced `DEFAULT_WORKER_MODEL_ID = deepseek/deepseek-v4-flash` for non-chat agents (distillation, keywords, future mechanical agents). Override only when intelligence demands it.
- Distillation `DEFAULT_DISTILLATION_MODEL_ID` aliases the worker default.
- Keyword conceptual correction: one word per keyword (plan §6.3 + pipeline prompts/schema).

## 19. Amendments — 2026-07-26 (save-path stripping — phase 5 start)

- `chat/messages/to-plain-text.ts` — extract `type: "text"` parts only (drops reasoning / tool parts that also carry `.text`).
- `chat/messages/strip-for-persistence.ts` — `stripMessagesForPersistence`: keep user/assistant plain-text rows; drop tool/system; empty after strip → omit.
- Wired into `build-response.ts`: after `chatAgent.generate`, persist stripped `response.messages` assistant rows (fallback to `generatedText`). Still returns `generatedText` for the iMessage send body.
- Next chunk: extract `distillChatMessage` from `tmp-distill-poc` + on-save schedule (`afterResponse` / `waitUntil`). Keywords-on-save and reindex remain later.
