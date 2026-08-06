# Stub: DM Agent + Cockpit (X Outreach)

Inherits: S9, S15, S36, S39, S42, MARKETING.md CAF. **HARD CAP: 1 day. Breach = fall back to fully manual outreach immediately (no extension).**

## Objective

Human-in-the-loop X DM system: agent ingests conversations via Zernio, drafts replies + follow-up timing, operator approves/edits/sends from Raycast. Personal account, honest automation only.

## Locked decisions

- **Zernio** as delivery/ingest API (free-tier DMs; TODO logged for alternatives). Webhooks → api-generated.
- Cockpit command "Send X DM Messages": task list of suggested replies + suggested follow-up times; per-thread detail view (recent messages or full thread); actions: edit-to-sound-like-me, approve+send, straight-send, mark done, snooze.
- **Canned away auto-reply** during work blocks (honest, ~24h promise) - personal AI-assisted DMs only, static text is fine.
- Every message/event logged to metrics tables from day one (sends, replies, qualified, handoff, timings) - S18 instrumentation, read via cockpit.
- Message content: opener leans on understanding their problem (S38 spirit); scripts live in `.context/marketing-generated/` and trace to OFFER.md; no payment links in DMs ever (S8); CTA = move to iMessage/Koa once qualified.
- Follow-up scheduling: store suggested times; v1 may surface "due follow-ups" as cockpit list (no QStash dependency); reuse self-scheduling constructs once live (S8).

## Build nuances

- Draft generation prompt gets: thread history, offer knowledge (OFFER.md excerpts), qualification criteria, tone examples from the operator's real DMs (request 3-5 samples).
- Message spacing / rate limits: conservative defaults, operator-tunable knobs in cockpit config. Research Zernio + X limits inside the cap; record findings in graph.md.
- Suggested-response confidence surfaced per draft so the operator triages fast.

## Assumptions (marked)

- Zernio webhook latency acceptable for non-realtime approval flow. [now]
- Single X account v1 (personal); Koa/ALTERED account split-test later (S15). [later]

## Verification

E2E: inbound DM → webhook → draft in cockpit → edited send → logged. Away-reply trigger tested. Metrics rows verified. Graph.md updated.
