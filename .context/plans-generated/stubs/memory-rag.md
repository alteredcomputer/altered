# Stub: Memory (RAG v1)

Inherits: S4, S6, S28, S29. Distillation is PAUSED - this replaces it for launch; advertise "proprietary memory strategy" honestly; hot-swap/dual-implement distill post-revenue.

## Objective

Simple, durable retrieval over chat messages + uploaded notes, feeding Koa's context. Clipped history + retrieved memories = the "remembers everything" claim made real at launch.

## Locked decisions

- **pgvector** in the generated DB (migratable; provider TODO list in S29). Embeddings via AI SDK + OpenRouter-available embedding model (research inside stub; record choice).
- History clipping: recent window / ~24h simple limit (formula reference: distillation plan discussion) - no full-history stuffing.
- Sources v1: Koa chat messages + Apple Notes uploads (via the ported launcher command, internal-raycast stub). Preserve source linkage (message/note id) on every chunk - S4 inviolable: never mutate source data.
- Retrieval tool exposed to the chat agent loop; optional exact-source search tool if cheap.
- BM25/hybrid: TODO post-launch (S4).

## Build nuances

- Chunking: keep dumb v1 (paragraph/sentence-window) - the operator's distillation heuristics come later; do not invent a clever scheme (S6 rationale).
- Retrieved context injected with token budget; drop lowest-similarity first; log retrieval sets per turn (metrics + future distill comparison).
- Upload path: idempotent re-uploads (hash source) so notes can be re-synced without duplicates.

## Assumptions (marked)

- Embedding cost negligible vs generation at cohort-1 volume. [now]
- English-only, no multi-user memory isolation needed beyond user_id scoping. [launch]

## Verification

Recall test on operator's real corpus: 10 known facts/ideas → retrieved in top-k. Duplicate-upload test. Latency within chat-response budget. Graph.md updated.
