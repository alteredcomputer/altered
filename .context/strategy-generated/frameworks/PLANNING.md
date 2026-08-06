# Framework: Planning for Planning

The edge-aware process for making any plan (code, marketing, offer, process) so decisions don't get reversed because a more important decision was discovered later.

## 1. Dependency expansion before action

Before planning any artifact, expand its dependency chain upward until it terminates at a settlement:

> DM message content → conversation structure/rails → target CTA → offer components → offer statement → demographic (S3) → root problem (S2) → operator constraints (S1).

Rules:
- Plan **top-down by dependency**, not by excitement or ease.
- If a node in the chain is unsettled, settle it (or explicitly assume it — see §2) before descending. This is what prevents "decided the bio, then the offer changed" backtracking.
- Every plan document must open with an **Inherits from:** line naming its parent settlements/plans.

## 2. The assumption register

Depth costs hours the operator does not have. The resolution:

- **Assume freely at low levels, but MARK every assumption** in the plan under an `## Assumptions (marked)` section: what was assumed, why it's probably fine, what would invalidate it.
- Verify assumptions **for scope only** at planning time (does this change what we build?) — correctness verification is deferred to the revision pass.
- Now-vs-later triage per assumption: `now` (blocks the sale or violates an inviolable from S4), `launch` (must resolve before user money touches it), `later` (post-revenue dissection).

## 3. Depth budgets

- Settlement-level decisions: unlimited depth (they're rare and load-bearing).
- System plans (stubs): structure + interfaces + locked decisions + marked assumptions. No line-level design.
- Implementation detail: belongs to the coding agent within the guardrails of `PRODUCT.md`; the operator reviews at the architecture/IO level, not line-by-line (except stable-tier code).
- If 2 hours pass inside one plan without a decision landing, the plan is over-scoped — cut, mark, move (the operator's own 2-hour reality-check rule, promoted to policy).

## 4. Step-back guardrail (for the coding agent and the human)

For any medium-significance-or-larger problem: before assuming a conclusion, step back and consider all options **including reframings of the parent directive itself** — push back with micro- and macro-level alternatives. Never brute-force around a problem that a one-level-up reframe dissolves (motivating examples recorded in S9).

## 5. Persistence discipline

- Decisions live in `SETTLEMENTS.md` or a plan doc — never only in chat.
- Comparisons of alternatives are **persisted with the verdict** so alternatives can't resurface as novel ideas.
- Plans state their own success/failure conditions and hard caps (time-boxed fallbacks like S9's 1-day DM-agent cap) at write time — the cap is part of the plan, not a negotiation at breach time.
