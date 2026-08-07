# Settlement Ledger

Settled 2026-08-02. Format per entry: **Verdict** / **Why** / **Rejected alternatives (and why)** / **Re-open cost**. Sub-decisions and open items are marked. This ledger exists because the operator's primary historical failure is forgetting the WHY of hard decisions and re-litigating them under pressure.

---

## S1 — Financial frame: do-or-die week

**Verdict:** ALTERED gets real movement (outreach live, offer in market) within 1 week — or the approach is treated as failed and re-planned. Lawn job stays as the floor. The job is dropped only when ALTERED revenue is consistent and supple enough to evidently compete with and overtake it. No all-in quit before that filter passes (protection for Kiera).

**Why:** "The only certainty I have is that which I create in a timely manner." The identity is do-or-die; the responsibility is the floor. Both are held simultaneously, and the alignment itself is maintained by reinforced reminders and memory (which is also the product — the recursion is intentional).

**Rejected:** Quit-now all-in (unprotected downside for Kiera); treat ALTERED as a side project until "built enough" (this is the years-long cycle itself).

**Re-open cost:** Only on hard external change (job loss, apartment outcome).

---

## S2 — Root problem (the WHY every artifact inherits)

**Verdict:** Builder/creator/entrepreneur **alignment + infinite memory**: you keep rebuilding, pivoting, and forgetting your own best thinking — Koa remembers everything and keeps you locked on the goal. **Self-scheduled messaging is the mechanism** that re-inforces your best thinking across future time, rather than on-request.

**Sub-settlements:**
- Riley's own routines (faith, running, tenets, identity) are the **user testimonial and case study**, not the product messaging (see S12).
- The Hormozi offer-optimization system is a **personal use-case** (md-plan-based process run with Koa/Cursor to optimize our own offer), and later "user use-case marketing" — never the product itself.
- Use-case success tracking: plain database tables + SQL queries for now (Attributes/editor later; refactor path preserved).

**Rejected:** "Actually USE your notes" (subset of the winner — folds in as a feature claim); consistency-only systems (drifts from ALTERED core); Hormozi optimizer as product (over-specialization, talked out of it in the July 27 note for reasons that still stand); faith slice as product (S12).

**Re-open cost:** High — bio, DM script, landing, Koa sales prompt all inherit from this. Requires a written counter-case addressing why the 5x-converged answer was wrong.

---

## S3 — WHO (first demographic)

**Verdict:** Tech builders on X — high-detail types building arbitrary/novel concepts, blocked from finishing by re-scoping and shifting life/identity priorities. The most fine-tuned reflection of the target is Riley himself.

**Expansion path (post-revenue + stabilization):** generalize to all builder/creator/founder/entrepreneur types (Dan Koe / Sedlak adjacency shown through use-case similarity). Detail-oriented general users (house organization → schoolwork) are an out-of-scope use case that "just works" — never marketed to directly.

**Re-open cost:** Medium. Channel, tone, proof format all inherit.

---

## S4 — Proof bar (what must exist before taking money)

**Verdict:** Sell on what runs today plus a hardened launch slice:
- Koa chat with persisted history, **clipped** (recent-window / ~24h simple limit — no full-history stuffing; too expensive).
- **Memory = simple, durable RAG (vector store)** over messages + uploaded notes. Advertise "proprietary memory strategy" honestly — distill/query gets hot-swapped or dual-implemented later once verifiable end-to-end (see S6). BM25 noted as a candidate optimization.
- **Self-scheduling ships as a launch feature** — it majorly compounds everything else.
- Proof material: real + precisely re-constructed single-lane use-case examples of successful re-calibration of intent/character/focus/action (pre-narrated, exportable as legitimate marketing material).

**Quality bars (the "feel-safe" checklist — expanded in `frameworks/PRODUCT.md`):** Chat SDK concurrency/debounce per docs; abort-signal wiring end-to-end; message sending moved to tools (multi-bubble); natural timing (real generation latency may cover most of it — child plan stub later); 3x error handling + observability; sufficient (not excessive) typing + runtime validation; Effect where it pays; EVLog to consider; test suite for every major operation touching user data; lint/security/abort-wiring scans with concrete verified pass conclusions; minimization + refactor passes replicating the existing ALTERED style.

**Inviolables:** No unintended mutation or loss of user inputs/data (source or butterfly effects). No missing metric collection. No instruction taint that corrupts a whole chat's responses. Everything else is correctable.

**Depth guard:** Lower-level dev assumptions are allowed for speed but must be **MARKED** in an assumption register for later dissection (see `frameworks/PLANNING.md`).

**Rejected:** Pre-sell with nothing ("in the age of AI, pre-selling is a form of execution incompetence"); wait for distillation (S6).

---

## S5 — AI-code policy

**Verdict:** A `*-generated` tier in the main repo. The agent may touch **only** `*-generated` packages and apps — repo-level changes, ENVs, catalog edits, etc. are *requested from the developer*, never performed. Structured revision pass at the end of every chunk is standard. A **separate API app + subdomain** hosts the generated tier so it stays out of the experimental variant.

**Data isolation (from S8 discussion):** each tier gets its **own database**, inherited at the application level. The generated tier imports the experimental ORM/data-access functions and uses **polyfill-style adapters** to translate incompatible shapes (translate where possible, omit + special-case where not). Never hack sibling tables into an upper tier.

**Rejected:** Separate repo (context friction killed the last attempt); marketing-only generation (too slow for the do-or-die week); case-by-case (is the relapse loop itself).

---

## S6 — Distillation: paused

**Verdict:** Pause distillation cleanly (commit state + note-to-self). Ship crude-but-durable vector RAG now. Resume distillation post-first-revenue as the flagship upgrade **delivered during the program**.

**Why:** The distill/query plan is highly arbitrary and untrusted until micro-process test cases can be manually verified (a future long-sprint manual feature). It may not beat vector on cost or effectiveness without refinement. Vector is a solid temporary base; swap is invisible to the promise ("proprietary memory strategy").

---

## S7 — Price + offer shape

**Verdict:** **$221 USD** (branded number), early-access experimental program, **6 months**, 10-15 seat *target* (marketing cap allowed lower; not hard-capped). Includes metered ALTERED usage allocation (~75% margin preserved; top-ups available via Polar). Systemized (not hourly-creeping) onboarding. Builds testimonials + feedback for cohort 2.

**Why $221 over $442 (recorded reasoning, operator asked for the call):** velocity of first yeses beats margin at current proof level; $221 is chat-closable without a call, which aligns with the Koa-close end-state (S8); 10 sales = $2,210 ≈ the apartment number; testimonial volume is the scarce asset. $442+ is the cohort-2 move once proof exists. A founding upsell (call + higher usage + build-slot input) may be layered later — marked open.

**Clarification (program vs transformation):** 6 months is **program inclusion duration** (access, support, usage allocation, upgrades landing during the window) — not a promised transformation window. Marketing may reference outcomes on shorter horizons.

**Future promises:** marketing vision, **not** offer components.

**Open items:** exact usage allocation ($20-100 band → pick after unit-cost check); price-lock vs discount language that doesn't chain future program pricing; free trial shape (leaning time+token-capped trial then sales mode, per "Use Koa free for X days" note) — decide in `stubs/payments-polar.md`.

---

## S8 — Close mechanism

**Verdict:** Agent-led close with human-in-the-loop. AI handles most sales objections and conversation branches; anything below **7.5/10 confidence** (esp. exact offer/product questions) escalates to Riley (directly, or via Cursor-assisted alignment, then forwarded). Human-like send behavior (delay + jitter, informal punctuation — fleshed out in stub). Self-scheduling constructs reused for cross-channel follow-ups. **Move prospects from X DMs to iMessage ASAP** — payment-link mentions in DMs risk platform bans; close happens in iMessage (or link there).

**Payments:** **Polar** (MoR, tech-forward, metering, Discord + app access automation). Revisit only for tax/pricing at scale.

**Open items:** billing model (hybrid Cursor-like base — marked-up tokens vs message vs time; notes exist); DM agent identifying as Koa (probably, not upfront); Typeform replaced by a dedicated Koa question-answering mode for campaign surveys.

---

## S9 — Outreach mechanics

**Verdict:** Build the DM agent **first** — simple reusable agent definition + orchestrator with human control knobs. **Hard cap: 1 day** for the AI-generated DM system; on breach, fall back to manual outreach immediately (no extension, no renegotiation). Then a content/posting agent for organic.

**Key design inputs:** message spacing/rate limits; API choice (Zernio-style intermediary vs direct — resolve in stub); control surface = internal Raycast extension (copy `feat/raycast-internal-base-init` tree, rename experimental→generated, apply stash 0 — **never drop/pop**); oRPC v2 `@beta` + TanStack Query wired like the old repo.

**Anti-failure mechanism (from past agentic build failures):** maintain a conceptual, strict, concise **feature/issue graph mirror** of the generated codebase — an exact implementation map of every quality pass, feature, edge case, issue, remark — so no code goes "stray"/undocumented/out-of-sync. Plus the step-back guardrail: for medium+ issues, consider all reframings of the parent directive before assuming a conclusion (examples that motivated this: the Raycast watcher ENV patch vs jamming everything into one package; TanStack Query built-in cancel/invalidate vs a mutex birds-nest).

---

## S10 — The two claimed prerequisites

**Verdict:** Do both, but as thin fast slices inside the generated tier: Raycast internal extension for controls (pnpm scripts remain for dev runs/testing); oRPC-in-Hono is trivial (docs: https://v2.orpc.dev/llms.txt, fallback https://orpc.dev/llms.txt); Better Auth per old repo setup, **API key over OIDC** for the internal extension (Raycast preferences, password field: https://developers.raycast.com/api-reference/preferences).

**Guard:** "Easy enough to do it all" holds only while the rails hold — any bloat/bug spiral triggers the S9 hard-cap fallback logic.

---

## S11 — Workspace consolidation

**Verdict:** `altered-no-code-1-week-gtm` is reference-only. This folder (`.context/_generated/gtm/`) is the fresh, segregated home. GTM AGENTS used as inspiration **minus** the half-baking-ALTERED-concepts instructions (we build those for real in `*-generated`, priority-ordered). Do **not** copy sources (Cursor chat exports searchable locally; don't bloat Koa). Notes upload as database entries via the launcher command copied from the old repo (UI + upload mechanics), conformed to updated "raw" thought heuristics, living in the internal extension. Marketing resources live in the altered repo under precisely defined constraints; AGENTS files updated to spec (draft in `agents/`).

---

## S12 — Faith placement

**Verdict:** Personal user-land system — daily directives + self-scheduled reminders through Koa once cron lands. Real usage doubles as demo/marketing proof. No separate product now. (Honours the July 31 conclusion: "that's still ALTERED, just *my* use case.")

---

## S13 — Daily operating split

**Verdict:** Hard split, externally enforced. Every day has a **revenue-action minimum** (DMs/follow-ups/content checks) that must complete **before** any product work. Koa (or manual cron until self-scheduling lands) reminds and demands acknowledgment. Evening product time is the reward, not the default.

---

# Round 2 settlements (2026-08-02)

## S7a — Offer economics resolved

- Included usage: **$50** per seat (pending unit-cost check against real OpenRouter logs).
- Trial: **time+token-capped free trial → sales mode**. Superior because the sale then happens off social-platform DMs (inside iMessage).
- Onboarding: **included, systemized ~30-min 1-1 call** (long-term program; operator wants to meet cohort-1 customers).
- Community: **Discord, included in cohort 1** (Polar automates access). Layout plan stub owed.
- Billing display: **Cursor-style dollar credit balance**, gated behind the one-time program purchase.

## S14 — Brand naming

**Verdict:** The offer fronts as **"ALTERED Koa"** (optionally "ALTERED Koa: <short benefit tagline>" — tagline locked in round 3).

**Rejected:** Alternate-branded campaign wrappers ("42", "Kyzn", "Preflight", personal-brand denominations) — they lean on use case or time/image depictions instead of the "it" of the product: Koa, a generalist tool that is part of ALTERED.

## S15 — Outreach model v1 (supersedes the S8/S9 open items it touches)

**Verdict:** **Personal account + human-in-the-loop draft-approve.** The agent ingests X DM webhooks/replies, suggests a counter-response + suggested follow-up time; surfaces as a Raycast task-list command ("Send X DM Messages") with optional thread view; operator edits-to-sound-like-me / approves / sends via API.

**Why:** Personal converts higher, but bot-pretending-to-be-a-person is rejected on principle — the exception is every message human-approved, which this is (Mochi-style, in-house).

**Later (optimization):** split-test a dedicated Koa account (or the ALTERED account — semantically correct but fewer persona benefits) reusing the same system with instruction/env/nuance changes only.

**Away coverage:** during work blocks, an openly-automated canned reply (honest auto-reply, ~24h response promise) — format confirmed round 3.

**Delivery API:** **Zernio** (feature matrix, DX, free-tier DMs/posting vs X API pay-per-use). TODO logged: explore alternatives later.

## S8a — Checkout mechanics

**Verdict:** **Polar checkout API sessions** (not static links) — Koa gathers user details (number etc.) before close, operator/agent micro-corrects, then a pre-filled checkout session link is sent in iMessage.

## S16 — Landing + profiles (resolves the round-1 lean away from a landing)

**Verdict:** Build a **hyper-minimal `*-generated` Next.js + shadcn landing** (template command in KNOWLEDGE.md; markdown-style, features + "text Koa" CTA; inspo images from operator at build time). Plus **end-to-end solidification of both X profiles** (personal + @usealtered): pictures, bios, banners, post history, pinned proof.

## S17 — Proof assets (resolves S4 proof-material selection)

**Priority:** **A** alignment save (Koa pulls operator back from a shiny-object pivot) → **B** memory recall (old voice-noted idea powering a new decision — e.g. the distillation plan was ~85% written from one) → **C** consistency directive (self-scheduled bugging-until-done with timestamps; run/bible/kitchen/National Girlfriend Day) → **D** offer-clarification session (optional, overlaps A). Optional testimonial as the opener of the proof carousel/thread.

## S18 — Movement pass/fail + scale KPI (sharpens S1)

**Verdict:** Week-1 pass = **first sale on working marketing + product systems**. Then: instrumented optimization loop (persist rich data models of every metric/response; manual Cursor-guided optimization passes on a plan we lay out). **Quit-the-job filter: 10+ sales per rolling month** (≈$2,800–3,200+ CAD) — enough proof of replicability to go all-in.

## S19 — Weekly capacity + planning budget

3–4 lawn days this week; ~3.5 off-days × 8–10h ≈ **32 focused hours**. Deep planning is acceptable **only** while coding agents build in the background; once rails are in, operator time trends toward oversight + minimal admin inputs (DM approvals, decisions). Excessive planning without parallel build = drift.

## S20 — Chat continuity protocol

Every substantial turn in the master chat ends with: settlements/knowledge sync to these docs + raw transcript copy to `strategy-generated/sources/`. New chats are fired per TODO plan **only after** the deeply-interdependent decisions are locked here — they boot from these docs, never from re-discovery.

## Working-state note (temporary)

No commits yet — currently on `feat/initial-distillation`, which the operator wants clean. AGENTS.md manual updates live on this branch; keep viewable until new AGENTS drafts are done, then the operator switches branches and commits.

---

# Round 3 settlements (2026-08-05)

## S21 — Koa tagline

**Verdict:** **"Never lose your best thinking again."**

**Why (operator's semantic breakdown, preserved):** "never" = hard anti-word; "lose" = forget + the pain of loss; "your best thinking" = peak clarity/effort/alignment without niche-narrowing words; "again" = consistency of solving it over time. Alternatives rejected: "remembers who you're becoming" (narrower, mirrors our use case, implied by winner); "infinite memory for the obsessed" (medium not benefit; "obsessed" fits ALTERED-brand level, park for later).

**Parked:** ALTERED brand-page tagline/description (later round). Candidates preserved: "Knowledge Orchestration Infrastructure", "Knowledge Systems for the Obsessed", "extend your brain", "Align with your obsession. Capture your thoughts, find clarity, take action.", "Store, develop, and use your thoughts on the fastest thought-to-action platform to exist."

## S22 — Offer statement (structure locked, final wording round 4)

**Locked components:** always-on · iMessage agent · detail-obsessed/high-detail technical founders · pressure pivots · redundant thinking · anti-patterns (long-form only) · resurfacing what you'd otherwise lose · locked on the goal (until it ships). Candidates + critique live in `frameworks/OFFER.md`. Char limits: X bio 160, IG bio ≤125 (no "see more").

## S23 — Program name

**Verdict:** **"ALTERED: Layer 1"** — brutal, semantic, epochal.

## S24 — Guarantee

**Verdict:** 30-day no-questions refund, **with a save-flow**: refund requests route through a support chat (human or Koa) where we may offer a personal consult, a fix, or an alternate promise before processing — still honoured unconditionally if they persist. Deliberate messaging placement so the guarantee earns its keep. Economics: other users subsidize refunds while AI cost stays low and lead flow holds.

## S25 — Offer outcome + stack (final)

**Outcome (lead):** aligned **progress** — speed, rate, and direction toward completing the real goal (for this demographic: shipping the SaaS) with the fewest switch-ups. Alignment is itself near-mechanism; completion is the output.

**Mechanisms:** infinite memory + self-scheduled reach-outs + effortless iMessage ergonomics (retention/engagement multiplier — part of the mechanism, not the wrapper).

**Stack:** 6-mo Layer 1 access · $50 usage (Cursor-style balance) · 30-min 1-1 onboarding call · Discord · **first-party feature prioritization** (reframed from "upgrades landing during window") · promised features framed as being-built tools (structured thinking / thought editor, system builder). **No price-lock** — we can offer to the lead list later. Keep the offer lean; the software is the product. Bonus-stacking (mini-course etc.) deferred until the product expands.

## S26 — Funnel confirmed

CAF v1 confirmed as drafted (round-3 Q21). IG has potential — later.

## S27 — Agent repo permissions (final, supersedes round-3 Q22 draft)

**Allowed without asking:** `*-generated` app/package creation; pnpm package install/uninstall; catalog modifications; per-package `turbo.json` in approved (generated) packages.
**Forbidden / operator-only:** root `turbo.json`; `.env.example`; any new env values (naming + provisioning go through the operator).

## S28 — Generated DB: extend-only

**Verdict:** Separate database, but **extend-only** — never copy upper-tier tables. Build on upper-tier data in-sync (for compatible models) via dual queries + transforms/polyfills that merge results. Patchy where needed; the goal is minimal redundancy and a trivially simple eventual migration.

## S29 — Vector store

**Verdict:** pgvector now (migratable). **TODO logged:** evaluate Cohere, Pinecone, Chroma, Weaviate, Faiss, Qdrant, Milvus, TurboPuffer, Upstash Vector.

## S30 — App names + graph home confirmed

`apps/api-generated`, `apps/web-generated`, `apps/raycast-internal-generated`. Feature/issue graph: single doc `.context/plans-generated/graph.md`; integrate divergence into the same doc.

## S31 — Scheduling architecture

**Verdict:** QStash **delays** (`publishJSON` + `notBefore`) as the primary primitive; **crons only** for exact recurring schedules ≤1yr (e.g. "clear emails 2pm Thursdays" — saves tokens); one-time exact = delay to date. Core principles:

- **Schedule intent, never pre-generated messages** — at execution, re-run the chat loop to pull current context/tone/factors before formulating the send (operator notes contain prior thinking on this; search when building the stub).
- **Jitter for all non-exact schedules** (human-like: "run around 2pm w/ 30-min heads-up" → fire 1:15–1:30, vary daily). Agent uses FEEL for non-exact, non-critical work.
- **Execution loop:** interpret related schedules/recent events → act (possibly start a chat instance) → update related schedules or schedule next.
- **Staleness prevention:** every chat turn, the agent must consider schedules (required tool step or hard instruction + frontloaded schedule names/descriptions in the ephemeral prompt) — call get-schedules, then update/create as needed, possibly via a subagent with its own instructions.
- **Cross-schedule adjustment** on any schedule/message change (blackout-meeting example) — implement if cheap, else TODO.
- **TODO:** migrate from Upstash delays (and crons if feasible) to in-house scheduling for cost — schedule volume will get expensive.

## S32 — No trial; direct sell

**Verdict:** No trial for launch. Koa sells directly over inbound iMessage — day-1 sale, 1-2 day cash conversion, fastest reinvestment loop. Trials = later marketing-optimization TODO (they lengthen the cash cycle, may not lift conversion with a good sales agent, and can even hurt). **Integrity constraint:** no forget-then-charge patterns, ever.

## S33 — Payments provider re-opened (amends S8a)

Polar holds funds 7 rolling days + manual payouts → 2-3x slower reinvestment at a 1-2 day optimized cash cycle, plus higher fees. **Evaluate Autumn + Stripe (https://useautumn.com/)** in a sub-plan deep-dive (terms, DX, feature parity, reliability). The pre-filled checkout-session concept stands regardless of provider.

---

# Round 4 settlements (2026-08-06)

## S35 — Messaging locked + copy style rules

**Master statement (locked):** "Koa is an always-on iMessage agent for detail-obsessed founders. It remembers everything you've ever told it - and uses it to eliminate pressure pivots, redundant thinking, and anti-patterns, keeping you locked on the goal until it ships."

**Bios (locked):** X and IG bios as drafted in OFFER.md.

**Demographic wording (locked):** **"detail-obsessed founders"** — generalizes beyond tech, founders > builders for accuracy. All-in or all-out with the demographic statement (never compress to bare "founders"). "Technical" = fallback/alt that leans code over general fine-detail work.

**Copy style rules (global, permanent):** **No em dashes in brand copy - hyphens only.** (Applies to all marketing surfaces and agent-generated copy.)

**TODOs (later, not now):** soften the "It remembers everything you've ever told it - and uses it to..." segment - it reads as every RAG chatbot's VP claim; candidate twists preserved: "remembers what you forget", "remembers EVERY detail". Consider de-duplicating "thinking" across X bio + tagline (may be intentional/beneficial). IG bio could stuff the demographic phrase within 125 chars.

## S36 — Channel sequencing: organic system is the dominant act

**Verdict:** The true dominant marketing act is a system that consistently produces killer posts (X for the tech demographic; IG later for entrepreneur-creator), with top organic performers promoted as targeted X ads. **Sequence: DMs now** (first revenue + tight raw feedback loop to shape marketing) **→ organic posting system** (authority + inbound) **→ paid amplification of proven posts** (post-data). Organic-first-then-ads gives authority; volume trumps minor optimizations and generates the data for them.

## S37 — Build delegation protocol

The master thread (this chat) is for locks and frameworks - building is delegated to cheaper models in fresh chats. Before any build begins: plans/stubs must detail the build nuances explicitly (locked decisions inlined, assumptions marked, references linked), then the master thread **stops and asks the operator to delegate**.

## S32 — UNDER REVIEW (round 5)

The no-trial verdict is re-opened by the operator with a legitimate counter-case (goodwill/generosity factor to offset low posting authority; trial-metric analysis value). Resolution pending the round-5 sales-flow decision. The integrity constraint (no forget-then-charge) is NOT re-opened.

---

---

# Round 5 settlements (2026-08-06)

## S38 — Sales flow: guided first-win (closes the S32 review; supersedes trial question)

**Verdict:** Every cold inbound starts in **guided discovery mode** (37a). Flow: macro clarity synthesis → set a **micro-scale near-reach bar** (a quantitative, feasible clarity goal, e.g. "your main features narrowed to their singular words + your public offer/mission statements drafted") → achieve it in **minutes/hours/days, not weeks** → the "wow, I completed thinking I couldn't do before" moment → sales mode engages. The wallet comes out after demonstrated achievement, not after a usage period.

**Follow-ups reframed:** scheduled follow-ups are a *"you haven't responded, let's finish this"* re-engagement lever (which implicitly demos always-on) - **not** the value gate. No follow-up-count framing (reads like "you get 1 alarm").

**Trial:** later split-test experiment only (post n≥10 sales conversations). Integrity constraint stands.

## S39 — Guiding principle: collapse the buying delay

**Verbatim (operator):** *"Buying delay is a lack of understanding, proof, trust, or personal need. People would purchase in SECONDS if they saw proof, trusted, and knew it was for them."*

**Verdict:** Optimize the Koa clarity+sales process for **speed AND effectiveness** - target a cash-conversion cycle of **hours**, ecom-style sales in software (sends → leads in minutes/hours → sales shortly after). Balance against conversion rate. On a hard no / cold edge / ignore: seamlessly extend to the longer nurture timeline (scheduled follow-ups). Speed levers: a more impressive-yet-achievable value target, compressing the sales process where acceptable, and voice-note input (S40).

## S40 — Voice notes: launch feature

Accept voice messages (.caf, .m4a, + non-Apple formats). **Save the files AND the transcriptions.** Rationale: users talk faster than they type - directly serves the S39 speed principle during discovery.

## S41 — Positioning guard + alternate VP (recorded)

Notes-ingest (Notion/Docs/Apple Notes) is an INSTANT lightbulb moment ("that feature idea from 3 years ago") but **any RAG can do that** - it is not the product. We optimize for **thinking, narrowing, alignment - converted to real-world execution that optimizes the scope, speed, and consistency of progress toward completion (shipping)**. Alternate VP preserved: *"purpose alignment for progress scope/speed/consistency towards completion."* **TODO (later):** consider incorporating into Koa's overall marketing/brand direction.

## S42 — System sequencing constraint (amends S36/38a)

Content agent is built **right after** the DM agent, but only once DMs are **effective and bulletproof** - never leave a broken or ineffective system running unattended. Fine-tune each system to standalone quality before attention moves to the next.

---

# Round 6 settlements (2026-08-07)

## S43 — Isolated generated iMessage resources

**Verdict:** The generated tier gets its own Sendblue number/credentials (operator provisioned the env vars). This number serves real users AND any `*-generated` iMessage testing - but prefer **simulation scripts and repo tests** over live-number testing wherever possible. Build chats must wire these generated-scoped vars, never the experimental ones.

## S44 — AUTO workflow mode for `*-generated`

**Verdict:** Generated builds run at **lowest operator input**: agent creates a branch, commits in small operator-style commits, pushes, merges (or opens a PR if merge isn't configurable) - **no chunk-stop reviews**, no long completion reports (few-sentence summary unless asked). Escalate ONLY: (a) deep, hard, newly-uncovered conceptual barriers → return to the orchestrator chat; (b) out-of-bounds/sensitive actions (service provisioning, root config, env values) → operator.

**Root cause of the current failure (recorded):** manual-workflow instructions in AGENTS.md drowned the auto context - agents stopped at every chunk like the manual flow. **Fix:** restructure AGENTS into root = shared rules + referenced sub-instruction files per workflow mode (**MANUAL** for operator-driven tiers, **AUTO** for `*-generated`). The manual workflow persists untouched for human-tier work.

**Target UX:** operator opens Cursor iOS, says "find the next non-completed task or plan and finish it," and returns to a polished, guardrailed, finished feature.

## S45 — Cloud/iOS steerability requirements

Everything orchestration- and build-relevant must be reachable from non-local cloud instances: local Cursor plans/chats exported to the repo (GTM-repo style as inspiration; export FROM latest); notes not yet in the database synced (from disk or GTM repo); adjacent repos (`altered-again`, GTM repo, etc.) fully backed up - **all branches pushed to GitHub, stashes backed up to branches**; Cursor configured with a GitHub token env var granting agents access to all repos under the `usealtered` and `inducingchaos` accounts/orgs.

## S46 — Sanitation rule (incident-driven)

**Incident:** database credentials were exposed in this master chat's tool calls and persisted into the committed transcript snapshot. Operator rolled the keys. **Rule (permanent):** anything saved to the repo that originated from chats/tool output (transcripts, exports, logs) gets a **credential-scrub pass before commit** (connection strings, tokens, key-shaped strings). Agents must also avoid echoing secrets into tool calls when avoidable (read env indirectly). Transcript snapshots are sanitized on every refresh.

## S47 — Manual workflow: tier-promotion extension (for AGENTS update)

The MANUAL mode gains an explicit promotion procedure: 1) always search lower tiers for rougher/current implementations to migrate, refactor, and promote; 2) craft the plan within the target scope from those findings; 3) implement in the promoted tier; 4) migrate any data/services cleanly and seamlessly; 5) import the promoted tier at its highest possible abstraction back down to replace the rougher code in the previous tier.

## Working notes (2026-08-07)

- Build-agent WIP from chat `f1263f9a` (Internal raycast implementation) stashed on main as: *"WIP: raycast-internal build agent (chat f1263f9a)..."* - pop when that thread resumes. **The base-init stash referenced by `stubs/internal-raycast.md` is now `stash@{1}`** - reference stashes by message/branch, never index.
- pnpm anomaly to investigate: version skew (11.13.0 on distill branch vs 11.8.0 on main; possibly corepack-installed locally), and a `.pnpm-store` created at repo root during the build-agent run - suspected Cursor sandbox behavior (manual `pnpm i` after deleting the folder did NOT recreate it). Determine if a preventive guard is worth adding.

---

## S34 — Meta-insight: the narrowing process is product

The settlement Q&A process itself (full memory → metaphysically-framed questions → dependency ordering → informed recommendations → persisted verdicts) produced the furthest offer clarity ALTERED has ever reached. **Study it; fold the mechanisms into Koa.** Future marketing angle preserved: "This single sentence made me $1m. Here's how I created it (and what came from it)."
