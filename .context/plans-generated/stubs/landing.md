# Stub: Landing (web-generated)

Inherits: S16, S35, OFFER.md. Hyper-minimal - this is a support surface, not the funnel core (DM → Koa is).

## Objective

One markdown-style page: offer, mechanism, proof, "Text Koa" CTA.

## Locked decisions

- Scaffold: `pnpm dlx shadcn@latest init --preset buFzXMW --template next` inside `apps/` → adapt to monorepo as `apps/web-generated`. New TSConfig extend or any repo-wide change = **operator approval first**.
- **Ask the operator for inspo images before building** (KNOWLEDGE §preferences).
- Copy strictly from OFFER.md: master statement (locked S35), tagline, stack, guarantee placement per MARKETING.md §5. No em dashes. "Detail-obsessed founders" all-in.
- CTA: iMessage deep link ("Text Koa") - every inbound starts guided discovery (S38/37a). Secondary: none v1 (no email capture unless operator asks).
- Design: monochromatic brutalist per root AGENTS style notes; Midday.ai as base-layer inspiration.

## Assumptions (marked)

- Single page, no CMS, no analytics beyond basic + click-through metric on CTA. [launch]
- Domain/subdomain naming: operator provides. [now]

## Verification

Lighthouse sanity, mobile pass (X traffic is mobile), CTA deep-link tested on-device, copy audit against OFFER.md. Graph.md updated.
