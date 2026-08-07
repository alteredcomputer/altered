# Orchestrator Resume Anchor

The designated restart point for the ALTERED GTM orchestrator chat. A fresh orchestrator session reads THIS file first, then follows the reading order below. Do NOT load `sources/gtm-master-chat.jsonl` unless a specific detail is disputed - it exists for archaeology, not context.

## Reading order (token-efficient)

1. This file (state + next actions).
2. `SETTLEMENTS.md` - all locked decisions S1-S47 with WHYs. The anti-relitigation ledger; read fully.
3. `KNOWLEDGE.md` - operational facts, commands, costs, design sketches, copy rules, operator preferences.
4. `frameworks/` (PLANNING, PRODUCT, MARKETING, OFFER) - read on demand per task.
5. `../plans-generated/ROADMAP.md` + `stubs/` - read the stub relevant to the task at hand.
6. `agents/generated-tier.md` - the AGENTS spec draft (install state: see next actions).

## Role of the orchestrator chat

Locks and frameworks only (S37): settle interdependent decisions via concise lettered Q&A rounds with recommendations, persist verdicts + WHYs to SETTLEMENTS, keep KNOWLEDGE current, write/adjust stubs, and delegate builds to cheaper models in fresh chats. Never build here. Every substantial turn ends with: docs synced + sanitized transcript snapshot refreshed (S46).

## Initiative state (compressed, as of 2026-08-07)

- **Offer locked:** ALTERED Koa, "Never lose your best thinking again", $221 one-time, 6-mo "ALTERED: Layer 1" program, $50 usage balance, 30-min onboarding call, Discord, 30-day refund w/ save-flow. Master statement + bios locked (S35, OFFER.md). Demographic: detail-obsessed founders on X (S3/S35).
- **Funnel locked:** personal HITL X DMs (Zernio, Raycast cockpit, honest automation) → iMessage handoff → Koa guided first-win (macro synthesis → micro-bar → "wow") → sales mode on bar completion → operator-approved close → pre-filled checkout in iMessage. No trial (S38). Hours-to-cash principle (S39). Voice notes at launch (S40).
- **Channel sequence:** DMs now → content agent once DMs bulletproof → top organic posts as X ads (S36/S42).
- **Build state:** ten stubs + ROADMAP written (`plans-generated/`). Wave 0 started: api-generated + raycast-internal-generated scaffolds exist as a **stash on main** ("WIP: raycast-internal build agent (chat f1263f9a)...") - pop when resuming that build thread. Generated DB + isolated Sendblue vars provisioned (S43). Distillation paused (S6); memory = pgvector RAG v1.
- **Quit-job filter:** 10+ sales/rolling month (S18). Week-1 pass: first sale on working systems.

## Immediate next actions (ordered)

1. ~~**AGENTS restructure**~~ **DONE (2026-08-07, PR #24 on main):** root AGENTS.md = shared rules + mode routing; `.agents/workflows/manual.md` (operator flow + S47 promotion procedure); `.agents/workflows/auto.md` (generated-tier scope/data/revision/graph + S44 git autonomy + S43/S46). `.agents/**` added to the modification blacklist.
2. ~~**Raycast-thread resume snippet**~~ **ISSUED (2026-08-07):** copy-block delivered to the operator for chat f1263f9a (pull new AGENTS, AUTO mode, pop its stash by message, continue `stubs/internal-raycast.md`). Build presumed in flight - check graph.md/branches for its progress before re-issuing.
3. **pnpm investigation:** version skew + root `.pnpm-store` anomaly (S47 working notes) - decide if a guard is warranted.
4. **Cloud-steering + backup pass (S45):** adjacent repos' branches pushed, stashes → branches, GH token env for `usealtered`/`inducingchaos`, notes sync, plan/chat export pipeline.
5. **Propagate S43** (isolated Sendblue vars) into chat-hardening/sales-agent build chats.
6. Resume ROADMAP waves (DM system next - 1-day hard cap - outreach starts immediately after).

## Standing operator context

Do-or-die frame (S1), hard daily split (S13), ~32h/week across ~3.5 off-days (S19), volume mantra (KNOWLEDGE). Q&A style: concise, lettered, recommendations marked, max per turn, plain chat not the question tool. No em dashes in copy. Sanitize anything chat-derived before committing (S46).
