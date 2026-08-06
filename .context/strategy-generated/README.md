# ALTERED GTM Master Context

Settled 2026-08-02 from the 13-question settlement series (Cursor chat, sourced from full Koa message history + Apple Notes exports + repo state). The `*-generated` context roots are the single source of truth for every proceeding of Riley (the human operator) about ALTERED (the vehicle), until superseded by ALTERED itself.

## Layout

- `.context/strategy-generated/` — this folder. The layer that governs plans.
  - `SETTLEMENTS.md` — the decision ledger. Every locked decision, its WHY, the alternatives compared, and the re-open cost. **Read this before proposing any direction change.**
  - `frameworks/PLANNING.md` — the edge-aware plan for planning itself (dependency expansion, assumption scoping, depth budgets).
  - `frameworks/PRODUCT.md` — the failsafe product-development process (the `*-generated` code tier, guardrails, revision passes, proof bar).
  - `frameworks/MARKETING.md` — the self-healing marketing process (anchor chain, KPI loop, correction protocol).
  - `frameworks/OFFER.md` — WHAT / WHO / WHY ALTERED is, with the fall-back / fall-forward mechanism.
  - `agents/` — draft agent-instruction specs (e.g. `*-generated` tier AGENTS additions) pending human review and installation.

- `.context/plans-generated/` — the specifics. `ROADMAP.md` on multiple timeframes, and `stubs/` with deep structured stubs per system, written to be delegated to coding agents. Pre-existing plans in `.context/_generated/plans/` migrate here once AGENTS.md is updated.

- `.context/marketing-generated/` — marketing artifacts: copy, scripts, proof assets, campaign docs. Every artifact names the settlement(s) it inherits from.

## Drift protocol (the self-healing part)

1. **Feel the pull to pivot?** Open `SETTLEMENTS.md`, find the relevant entry, re-read the WHY and the rejected alternatives. 90% of pivots die here — they are usually a rejected alternative resurfacing with new packaging.
2. **The pull survives?** Write the counter-case as a dated addendum under the entry. Sleep on it once. If it still stands, it's a legitimate re-settlement, not a relapse.
3. **New information (not mood)?** Same protocol, but a same-day re-settlement is allowed when hard external facts changed (pricing data, platform bans, conversion numbers).
4. **Every plan or artifact created anywhere** (landing copy, DM scripts, code plans) must name which settlement(s) it inherits from. Orphan artifacts are drift by definition.

## Known operator failure modes (write-once, remind-forever)

- Evening relapse: work-hours urgency ("what closes revenue in 3 hours?") decays after work into "I could take 5 days for this feature." Countered by S13 (hard split) and by re-reading this file.
- Prerequisite invention: new infrastructure gets framed as a blocker for revenue work. Countered by S10 (prereq honesty check) and hard caps in `frameworks/PRODUCT.md`.
- Pressure pivots: under financial stress, novel offers appear (Lawn Medic, ecom, Bible app as product, B2B consulting). Countered by S2/S12 and the drift protocol.
- Depth spirals: micro-detail design in chat/dev costs hours that don't exist. Countered by the assumption register in `frameworks/PLANNING.md` — assume, MARK, move.
