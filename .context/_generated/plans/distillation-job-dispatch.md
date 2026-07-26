# Distillation Job Dispatch

Status: **direction recorded; not fully implemented**. Companion to `thought-distillation-poc.md` §7 (async trigger) and §20 (on-save schedule).

## Problem

`scheduleDistillationForMessage` currently runs `distillChatMessage` in-process on the chat webhook request. That couples reply latency/runtime to a multi-minute tool loop and misuses serverless request lifetime.

## What `waitUntil` / `afterResponse` actually is

Correct: extend the **current** invocation so work can finish after the HTTP response is sent.

Incorrect: a job queue / dispatcher.

Fine for tiny post-response chores (preference write, forward webhook). Wrong long-term home for distillation (many LLM steps, minutes, failures, retries, reindex batches).

## Options

| Approach | Fit | Cost / ops | Notes |
|---|---|---|---|
| **In-process + `waitUntil`** | Weak | Free | Extends webhook; still one invocation; easy to hit limits; poor failure isolation. |
| **Internal Hono job endpoint + fire-and-forget `fetch`** | Strong for POC → v1 | Free (same app) | Fluid Compute allows long `maxDuration` (up to ~800s). Chat path returns immediately; job route owns the work. Status via `agent_runs`. |
| **QStash → job endpoint** | Strong v1.5 | Cheap | At-least-once delivery, retries, backoff, dead-letter-ish visibility. Already on Upstash. Does not replace the worker — it *invokes* it. |
| **Upstash Workflows** | Optional later | Medium | Better when the job is a **multi-step durable workflow** (fan-out chunks, wait, resume). Distill is mostly one agent loop today. |
| **Trigger.dev** | Optional later | Medium–high | Excellent DX/observability for long jobs. Another runtime/vendor. Worth it when job surface grows (reindex, notes upload, query batches) — not required for first on-save distill. |

## Recommendation

1. **v1 worker:** `POST` internal job route on `api-experimental` (Hono), e.g. `/jobs/distill-message`, body `{ messageId, indexKeywords? }`, auth via shared secret / internal header. Set route `maxDuration` high under Fluid Compute. Handler calls `distillChatMessage` (already persists `agent_runs` + file logs).
2. **v1 dispatcher:** `scheduleDistillationForMessage` becomes fire-and-forget `fetch` to that route (do not await completion). Chat webhook stays thin.
3. **Status / errors:** `agent_runs` is the job ledger (`pending` → `running` → `succeeded` | `failed` + `error`). Re-trigger by run id / message id via CLI (already half-true with `tmp-distill-poc`). No separate job table until that proves insufficient.
4. **v1.5 reliability:** Put **QStash** in front of the same endpoint when silent drops or transient 5xx matter. Ordering is usually unnecessary (per-message independent); retries and failure visibility are the win.
5. **Defer Trigger.dev / Upstash Workflows** until we need durable multi-step orchestration, concurrency controls, or richer dashboards across many job types. Infinitely scalable serverless does **not** remove the need for retries — it only removes capacity planning. Tracking status without auto-retry still leaves gaps when the job function is killed mid-run.

## Non-goals (for now)

- Exactly-once semantics (duplicate distill is accepted for POC; runs are filterable).
- Global job ordering across messages.
- User-visible job UI.
- Using `waitUntil` as the distill runner.

## Implementation checklist

- [x] Add authenticated Hono job route (`POST /jobs/distill-message`); `maxDuration: 800` on api-experimental.
- [x] Flip `scheduleDistillationForMessage` to HTTP dispatch. `SHARED_JOBS_SECRET` is required (`string > 0`).
- [x] Job route returns **200** immediately, then runs `dispatchDistillationJob` under `waitUntil`. Chat **awaits** the short enqueue accept (not the distill loop).
- [ ] Ensure `agent_runs` row is created **at job start** before heavy work (already first step inside `distillChatMessage`; verify under kill tests).
- [ ] CLI re-run path for failed `agent_runs` / message ids.
- [ ] Optional: QStash publish instead of bare `fetch`.
- [ ] Wrap chat-side short dispatch `fetch` in webhook `waitUntil` if accepts drop.

## Decision rule

If the work must outlive the user-facing request → **separate invocation** (job route).  
If the work is a few ms after respond → `afterResponse` / `waitUntil` is fine.  
If the work needs retries across deploys/crashes → **QStash (or Trigger.dev)** in front of the worker.
