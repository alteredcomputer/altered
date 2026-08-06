# Stub: Sales Agent (Guided First-Win + Close)

Inherits: S8, S24, S32/S38, S39, S41, OFFER.md, MARKETING.md. The highest-leverage prompt work in the company - treat the discovery prompt as both sales script AND the S34 offer-clarity mechanism productized.

## Objective

Every cold inbound iMessage number enters guided discovery mode: macro synthesis → micro-bar → achievement → sales mode → close in hours.

## Locked decisions

- **Flow (S38):** designed discovery interview (their project, goal, pivots, re-derived conclusions; voice notes accepted) → **macro clarity synthesis** (their goal razor-sharp, drift pattern named, what Koa would hold them to) → **set micro-scale near-reach bar** (quantitative, feasible, "wow"-capable; e.g. features narrowed to singular words + public offer/mission statements drafted) → work to the bar in minutes/hours → **sales mode triggers on bar completion**.
- **Speed principle (S39):** collapse understanding/proof/trust/personal-need gaps; compress the sales sequence where acceptable; target hours-to-cash. Hard no / ignore → scheduled follow-up nurture (re-engagement lever, respects hard STOP).
- **Escalation:** <7.5/10 confidence (esp. exact offer/product questions) → operator (direct or Cursor-assisted, then forwarded). Operator approves each close before checkout link (v1).
- **Human-like sends:** delay + jitter, informal punctuation; awaited-tools generation latency may cover most of it - assess before faking (S4).
- **Offer knowledge base:** OFFER.md messaging bank + stack + guarantee w/ save-flow (S24) + Hormozi-style objection rails; no claims outside the stack; no em dashes.
- Positioning guard (S41): demo thinking/narrowing/alignment - never lead with "chat with your notes" (any RAG can).
- All conversations logged for analytics/review (S18); refund-adjacent + objection turns tagged for the optimization pass.

## Build nuances

- Mode state machine per contact: discovery → bar-work → sales → closed/nurture; stored in generated DB; admin override via cockpit.
- Synthesis + bar as persisted artifacts (they become the prospect's first "thoughts" - seed data if they convert).
- Sales-mode system prompt separate from program-member prompt; instruction-taint inviolable: mode prompts must be isolated per-conversation.
- Voice notes (S40): accept .caf/.m4a + non-Apple; store file + transcription (chat-hardening stub owns the pipeline).

## Assumptions (marked)

- Micro-bar templates: 2-3 hand-written variants v1, agent selects; dynamic bar-generation later. [launch]
- Checkout handled by payments stub; this stub emits "ready-to-close" event + gathered details. [now]

## Verification

Full dry-run with operator + 2 friendly testers: cold text → synthesis quality reviewed by operator → bar achieved → sales mode → mock close. Escalation path fires. STOP respected. Metrics rows complete. Graph.md updated.
