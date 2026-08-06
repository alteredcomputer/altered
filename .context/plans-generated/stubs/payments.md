# Stub: Payments + Metering

Inherits: S7/S7a, S8a, S32, S33, S39. First task inside this stub is the provider decision - do not build on Polar assumptions until settled.

## Objective

$221 one-time Layer 1 purchase → app access + Discord + $50 Cursor-style usage balance, with a cash cycle measured in hours-to-days.

## Locked decisions

- **Provider deep-dive first (S33):** Autumn + Stripe (https://useautumn.com/) vs Polar. Compare: payout speed (Stripe ~2-3 days automatic vs Polar 7-day rolling + manual), fees, metering/credit-balance support, checkout-session prefill, Discord/app access automation, MoR tax implications, DX/reliability. Record verdict + WHY in graph.md and SETTLEMENTS addendum.
- **Checkout sessions, not static links** - pre-filled with details Koa gathered in-thread (number, name, email); operator micro-corrects pre-send (S8a). Links sent in iMessage only.
- **Billing display:** dollar credit balance (Cursor-style hybrid as base; operator has notes on token-markup vs message vs time - consult before finalizing metering unit). ~75% margin target on the $50 allocation; top-ups purchasable.
- **No trial (S38). No forget-then-charge patterns ever (S32).**
- Refund path implements the S24 save-flow (support conversation first; honoured unconditionally if persisted; logged as signal).

## Assumptions (marked)

- Usage metering unit = marked-up token dollars v1. [launch, pending operator notes check]
- Webhook-driven provisioning (purchase → access flags + Discord invite + balance credit) fully automated. [launch]

## Verification

Test-mode purchase E2E: Koa-gathered details → session → payment → provisioning → balance visible. Refund flow test. Payout timing confirmed against S39 target. Graph.md updated.
