# Framework: Marketing (Self-Healing Process)

Inherits from: S15–S18, S24–S26, S32, OFFER.md. Every marketing artifact names its parent settlement(s); orphan artifacts are drift.

## 1. Anchor chain

All marketing derives down this chain and heals up it (see OFFER.md fall-back mechanism):

> root problem (S2) → demographic (S3) → offer (OFFER.md) → messaging bank → channel (X) → systems (agents + cockpit) → metrics

No artifact (bio, post, DM script, landing block) may introduce claims that don't trace to the offer stack. This is the hard guard against offer-twisting.

## 2. CAF v1 (locked funnel — S26)

| Stage | Owner | Tooling | Core metric |
|---|---|---|---|
| X profile + proof thread | operator (one-time) + content agent (later) | profiles dialed end-to-end; pinned narrated-screenshot thread (S17 order: A→B→C→D) | profile visits → DM rate |
| Personal DM outreach | operator-approved drafts | agent drafts via Zernio webhooks → Raycast cockpit (edit / approve / send); canned honest auto-reply during work blocks | sends, reply rate |
| Qualification | agent + operator | suggested counter-responses + follow-up times; scheduled follow-ups | qualified rate |
| iMessage handoff | prospect self-serve | "text Koa" CTA (deep link) | handoff rate |
| Guided first-win (S38) | Koa (discovery mode) | macro synthesis → micro-bar set → achieved in minutes/hours; voice notes accepted (S40) | bar-completion rate, time-to-bar |
| Koa sale | Koa (sales mode, triggers on bar completion) | <7.5/10 confidence escalates to operator; human-like timing; no trial (S38); follow-ups as re-engagement lever | close rate, **hours**-to-cash (S39) |
| Checkout | Koa + operator approval per close | pre-filled checkout session in-thread (provider pending S33) | completed checkouts |
| Fulfillment start | operator + automation | onboarding call booked, Discord access, program start | activation |

IG variant: later. Content/posting agent: after DM agent (S9).

## 3. KPI loop

- **Week-1 pass:** first sale on working marketing + product systems (S18).
- **Scale filter:** 10+ sales per rolling month (≈$2,800–3,200+ CAD) → quit-job threshold (S18, S1).
- **Cash cycle:** optimize toward 1–2 day lead-to-payout reinvestment (S32/S33). This KPI outranks conversion-rate vanity.
- **Instrumentation:** persist rich data models of every metric/response (sends, replies, qualification, handoffs, closes, refunds, timings) in the generated DB from day one — Raycast views read them; optimization passes consume them.

## 4. Correction protocol (the self-healing part)

1. A metric misses → identify the funnel stage → apply the **shallowest-first** rule (OFFER.md): copy → proof → mechanics → price → stack → demographic → problem.
2. Minimum evidence before judgment: n≥30 DM sends per script variant; n≥10 Koa conversations per sales-flow change. Below threshold, collect — don't rewrite.
3. Every change: dated entry in `.context/marketing-generated/` with trigger metric, hypothesis, and result on review. Optimization passes are manual, Cursor-guided, against these records (S18).
4. Refund requests run the S24 save-flow and are logged as signal (which promise under-delivered).

## 5. Standing constraints

- Honest automation only: no fake-human bots (S15); no forget-then-charge patterns (S32); payment links only in iMessage, never X DMs (S8).
- Copy discipline: "founders" not "creators" in cohort 1 (S3, OFFER.md).
- Guarantee placement is deliberate (S24) — present it where it de-risks the close, not as a headline.
