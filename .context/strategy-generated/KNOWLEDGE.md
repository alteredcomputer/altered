# Knowledge Index (fine-detail, non-settlement)

Details and intermediary thinking from the master GTM chat that must not be re-discovered in fresh chats. Settlements live in `SETTLEMENTS.md`; this file holds the operational facts, commands, constraints, and design sketches beneath them. Raw transcript snapshots: `sources/`.

## Costs + platform facts

- **Sendblue:** $100 USD/mo tier removes contact verification. Limits: ~1,000 new inbound contacts/day; no outbound to brand-new numbers, but replies within existing conversations effectively unlimited. Build/test with personal + Kiera's number + placeholder accounts before starting the paid tier. No scale blockers until real volume.
- **Cost stack:** AI inference (dominant) + Sendblue sub + minor Vercel/Neon/Upstash/UploadThing.
- **Zernio:** X DM + posting intermediary; free-tier DMs/posting vs X API pay-per-use; chosen (S15). TODO: revisit alternatives post-launch.
- **Polar:** MoR; checkout **API** sessions with pre-filled customer details (gathered by Koa in-thread pre-close); automates Discord + app access; metering for the $50 usage allocation + top-ups; Cursor-style hybrid billing model as base (operator has notes on token-markup vs message vs time billing).

## Commands + technical references

- Landing scaffold: `pnpm dlx shadcn@latest init --preset buFzXMW --template next` — run inside `apps/`, then adapt to the monorepo. May need a new TSConfig extend → **requires operator approval** (repo-wide change; `*-generated`-only rule holds).
- Raycast internal extension: copy tree from branch `feat/raycast-internal-base-init`, rename experimental→generated, **apply stash 0 (never drop/pop)**.
- oRPC v2 docs: https://v2.orpc.dev/llms.txt (fallback https://orpc.dev/llms.txt). Better Auth per old repo; **API key over OIDC** for internal extension; Raycast preferences password field for key storage (https://developers.raycast.com/api-reference/preferences).
- Notes upload: copy the old repo's launcher upload command (UI + mechanics), conform to updated "raw" thought heuristics, house in internal extension (S11).

## Design sketches (pre-stub)

- **DM cockpit (Raycast):** "Send X DM Messages" command → task list of suggested replies + suggested follow-up times; optional per-thread list view showing last few messages or full loaded conversation; actions: edit-to-sound-like-me, approve, straight-send via API, mark done.
- **Away auto-reply:** openly-automated canned X DM reply during work blocks ("not available right now, will respond within 24h") — honest bot disclosure, no fake-human.
- **iMessage sales agent (post-handoff):** human-like send behavior (delay + jitter, informal punctuation); <7.5/10 confidence → escalate to operator (direct, or via Cursor-assisted alignment then forwarded); reuses self-scheduling constructs for cross-channel follow-ups ("need to check something" → scheduled follow-up).
- **Proof thread:** optional testimonial opener, then assets in S17 priority order (A alignment save, B memory recall, C consistency directive, D offer clarification).
- **Metrics:** persist rich data models of every metric/response (DMs sent/replies/qualified/handoffs/checkouts/sales, timing) — feeds the manual Cursor-guided optimization passes toward the 10-sales/rolling-month KPI.

## Copy style rules (global)

- **No em dashes in brand/marketing copy - hyphens only** (S35).
- Demographic phrase all-in or all-out: "detail-obsessed founders" (S35).
- Operating mantra (operator, verbatim energy): "VOLUME WILL TRUMP MINOR OPTIMIZATIONS AND GIVE US THE DATA WE NEED" - volume first, optimize from data.

## Operator working preferences (this initiative)

- Q&A process: concise, strategically ordered, lettered options with recommendations, **max questions per turn**; sequential turns only for true dependencies; minor corrections handled inline.
- All no-going-back, deeply-interdependent decisions are locked in the master chat; fresh chats per TODO plan afterwards (master thread is expensive).
- Planning depth: operator spent ~4h on one answer round — acceptable for critical initial planning only; once rails are in, planning must run alongside background agent builds.
- Question-tool UI is buggy (drops custom responses) — use plain chat messages with options.
- Git: mode-dependent since the S44 restructure - MANUAL tiers stay read-only (operator commits); AUTO (`*-generated`) agents branch/commit/push/merge autonomously per `.agents/workflows/auto.md`. Orchestrator chat works on branches; operator merges.
- Landing inspo images: operator has examples — **ask for them when building the landing**.

## Scheduling references (S31)

- QStash schedules (cron): https://upstash.com/docs/qstash/features/schedules — `client.schedules.create({ destination, cron })`.
- QStash delays (primary): https://upstash.com/docs/qstash/features/delay — `client.publishJSON({ url, body, notBefore: <unix> })`.
- Worked examples preserved: run-reminder ("around 2pm, 30-min heads-up" → jittered fire 1:15–1:30, re-scheduled daily with fresh jitter); exact cron ("clear emails 2pm Thursdays"); cross-schedule adjustment (new 1:00–1:25 blackout meeting → nudge 1:23 reminder to ~1:28).
- Cron limits: no multi-year intervals; crons save tokens vs agent re-scheduling for exact recurrences.
- Operator's notes contain prior reasoning on schedule-with-intent vs pre-generated messages — **search notes when building the scheduling stub**.

## Payments research (S33)

- Polar drawbacks found: 7-rolling-day fund holds, manual payouts, higher fees → conflicts with 1–2 day reinvestment cycle.
- Candidate: **Autumn + Stripe** — https://useautumn.com/ — sub-plan deep-dive owed (terms, DX, feature parity, reliability). Stripe payouts ≈ day 2–3.

## Copy constraints

- X bio limit 160; IG bio ≤125 avoids "see more".
- Tagline semantics + full messaging bank + word-bank rationale: `frameworks/OFFER.md`.

## Meta-process study item (S34)

Mechanisms that produced the offer-clarity breakthrough, to fold into Koa: full-memory grounding (messages + notes read in full) · metaphysically-framed questions that surface unseen constraints · dependency-ordered question sequencing · informed recommendations attached to options · persisted verdicts with WHYs (anti-relitigation) · concise per-turn batching. Future marketing story: "This single sentence made me $1m."

## Parked / open threads

- ALTERED brand-page tagline/description (candidates preserved in S21/OFFER.md) — later round.
- Master offer statement final pick (M1/M2/M3) + bio confirms — round 4.
- Billing model final shape (Cursor-hybrid base) — payments stub (now includes Autumn-vs-Polar).
- Discord server layout — stub owed.
- DM agent identity on the future dedicated-account variant (Koa vs ALTERED account) — split-test later (S15).
- BM25 / retrieval optimizations — post-launch memory iteration (S4/S6). Vector provider TODO list: S29.
- EVLog adoption — decide during build, record verdict.
- Content/posting agent for organic — after DM agent (S9).
- Alternate DM API providers — TODO after Zernio proves out.
- Trials as marketing optimization — later (S32).
- In-house scheduler migration off Upstash — later (S31).
- Cross-schedule auto-adjustment — implement if cheap during build, else TODO (S31).
