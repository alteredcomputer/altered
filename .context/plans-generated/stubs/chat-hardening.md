# Stub: Chat Platform Hardening + Voice Notes

Inherits: S4 (quality bars + inviolables), S40. Gates the proof bar (PRODUCT.md §4) - handoff CTA does not go live until this passes.

## Objective

Fast, smooth, natural, data-safe iMessage experience on the generated Koa path.

## Locked decisions

- **Concurrency/debounce:** configure Chat SDK options per its docs for spam-burst inbound; comb abort signals backend-wide top-to-bottom; revert cleanly per execution path (checkpoint intermediary status messages like "let me check on that" where possible; throwing away expensive generations is acceptable).
- **Tool-based sending:** move message sending to tools (multi-bubble chunks) instead of finish-text interpretation. Timing: real generation/tool latency may be natural enough - assess, then child-plan the iMessage human-timing work only if needed.
- **Voice notes (S40):** accept .caf/.m4a + non-Apple formats; store original file (UploadThing) + transcription (model choice researched in-stub); both linked to the message row.
- **Dedupe:** provider message-id dedupe (known gap from STATE.md) - required, replay/webhook duplicates must not double-process.
- **Observability + errors:** 3x pass - sufficient typing + runtime validation (ArkType), retries on provider calls, structured logs. Effect where it clearly pays; EVLog considered - record verdict either way.
- **Metrics:** every funnel-relevant event captured (S4 inviolable: no missing metric collection).

## Assumptions (marked)

- Sendblue testing on personal/Kiera/placeholder numbers until the $100/mo tier is justified (KNOWLEDGE §costs). [now]
- Transcription language English-only v1. [later]

## Verification

Test suite over: burst-input debounce, abort/revert, dedupe on replayed webhook, voice-note round-trip (file + transcript persisted), send-tool multi-bubble. Lint/security/abort-wiring scans with recorded pass conclusions (S4). Graph.md updated.
