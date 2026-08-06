# Stub: Self-Scheduling

Inherits: S31 (full architecture), S38 (follow-up lever), S39. Launch feature (S4).

## Objective

Koa schedules future intents and executes them as fresh, context-aware chat turns - the always-on mechanism.

## Locked decisions

- **QStash delays** (`publishJSON` + `notBefore`) primary; **crons only** for exact recurring ≤1yr; one-time exact = delay. Docs in KNOWLEDGE.md §Scheduling.
- **Schedule intent, never pre-generated messages.** Execution re-runs the chat loop with current context (recent messages, related schedules, memory) before formulating any send. Search operator notes for prior reasoning before finalizing the execution-loop design.
- **Jitter on all non-exact schedules** (agent "FEEL" for human-like timing; e.g. "around 2pm w/ 30-min heads-up" → fire 1:15-1:30, re-jittered per occurrence).
- Execution loop may: act (send), re-schedule itself, create/update/cancel related schedules.
- **Staleness prevention:** every chat turn considers schedules - frontload schedule names/descriptions in the ephemeral prompt + get-schedules / upsert-schedules tools (subagent with own instructions acceptable). Any schedule-relevant message triggers review.
- Cross-schedule adjustment (blackout example in KNOWLEDGE.md): implement if cheap, else TODO.
- TODO: in-house scheduler migration for cost at volume.

## Build nuances

- Schedule rows in generated DB: intent text, timing spec (exact/cron/window+jitter), status, lineage (what created/last-modified it), user scope. QStash message id stored for cancellation.
- Callback endpoint on api-generated must be idempotent (QStash retries) and verify QStash signatures.
- Sales-agent dependency: follow-up scheduling (S38) is just an intent row - no special casing.

## Assumptions (marked)

- Upstash free/low tier sufficient for cohort-1 volume. [now]
- Timezone: single per-user tz string captured at onboarding. [launch]

## Verification

E2E: "remind me around X" → row + QStash delay → jittered fire → context-aware send → re-schedule. Cancellation + edit paths. Duplicate-callback idempotency test. Graph.md updated.
