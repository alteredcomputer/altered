# Roadmap

Inherits: S1 (do-or-die week), S13 (hard split), S18/S39 (first sale week 1, hours-to-cash), S19 (~32h across ~3.5 off-days), S42 (sequencing). Dates float with lawn schedule; order does not.

## Wave 0 - Foundation (off-day 1, ~half day)

1. Operator: review + install AGENTS spec (`strategy-generated/agents/generated-tier.md`), switch branches, commit docs, provision `SHARED_GENERATED_STORAGE_DATABASE_URL` + Zernio + QStash keys.
2. Delegate: scaffold `apps/api-generated` (Hono + oRPC v2 @beta + Better Auth API-key mode) per `stubs/internal-raycast.md` §foundation.
3. Delegate: `apps/raycast-internal-generated` from `feat/raycast-internal-base-init` (copy tree, rename, apply stash 0 - never drop/pop) + oRPC/TanStack Query wiring.

## Wave 1 - DM system (off-day 1-2; HARD CAP 1 day, fallback = manual outreach)

4. Delegate: `stubs/dm-agent.md` - Zernio ingest, draft suggestions, Raycast cockpit command, metrics tables, canned away auto-reply.
5. Operator: X profiles dialed (bios locked in OFFER.md), proof thread v1 (S17 assets A→B), first approved DM batch out. **Outreach runs daily from here (S13 minimum), personal nurture until Koa slice is live.**

## Wave 2 - Koa launch slice (off-days 2-3.5)

6. Delegate: `stubs/memory-rag.md` (pgvector, clipped history, notes upload) + `stubs/chat-hardening.md` (concurrency, aborts, tool-based sends, voice notes S40, metrics).
7. Delegate: `stubs/self-scheduling.md` (QStash delays/crons, intent-based execution, jitter).
8. Delegate: `stubs/sales-agent.md` (guided first-win S38, micro-bar, sales mode, escalation).
9. Proof-bar checklist (PRODUCT.md §4) verified → handoff CTA goes live in DM conversations.

## Wave 3 - Commerce + surfaces (in parallel where hours allow)

10. Delegate: `stubs/payments.md` (Autumn-vs-Polar deep-dive decided inside the stub, checkout sessions, $50 balance).
11. Delegate: `stubs/landing.md` (web-generated, shadcn preset; ask operator for inspo images). `stubs/onboarding-discord.md`.
12. Target: **first close** - Koa-run, operator-approved (S8), hours-to-cash measured.

## 30 days

DM volume scaling; content agent (`stubs/content-agent.md`) once DMs are bulletproof (S42); 1-2 posts/day approved via cockpit; optimization passes per MARKETING.md §4; cohort-1 fulfillment (onboarding calls, Discord); distillation resume evaluation (S6) once revenue exists.

## 90 days

10+ sales/rolling month → quit-job filter (S18); top organic posts → targeted X ads (S36); cohort 2 at $442+ (fall-forward, OFFER.md); trial split-test if objection data warrants (S38); in-house scheduler migration evaluation (S31).

## 12 months

Demographic expansion per S3 (creators/IG); distillation as flagship memory upgrade delivered to cohort 1; structured thinking / thought editor / system builder tools (S25 being-built list); manual quality promotion of generated code (PRODUCT.md §6); ALTERED brand-page identity round (S21 parked).
