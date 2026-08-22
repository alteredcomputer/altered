# PLAN STATE (Generated)

Last updated: 2026-08-21

## Focus

Versioning certification (the Commit Covenant). Building the commit gate and merge gate in `@altered/tooling`, then running the genesis ritual so no file in the repo is tracked unless a human certified it.

## Plan linkage

- Primary plan: `.context/_generated/plans/versioning-certification-covenant.md`
- Origin chat: Cursor conversation `b5f36806-90e5-4781-8765-635443049965`
- Source chat (idea, verbatim spec, wall roadmap Wave A item 3): `ea57fce1-6323-4513-86d9-711912e97371`, snapshot at `.context/strategy-generated/sources/gtm-master-chat.jsonl`

## Confirmed status

- Nothing built yet. No git hooks exist in the repo (`.git/hooks` is all `.sample`).
- `@clack/prompts@1.2.0` already resolves in `node_modules` transitively via ultracite.
- TTY refusal verified: an agent shell has no usable `/dev/tty`, so `exec < /dev/tty` in a hook blocks both agent commits and piped answers.

## Next

1. Branch `feat/versioning-certification`: config, hooks, commit gate, trailers, merge gate.
2. Branch `refactor/certification-genesis`: `git rm -r --cached .`, tag `covenant/genesis`, then re-add the tree in certified chunks.

## Superseded

- Wave 0 generated-tier focus (Raycast internal cockpit, `*-generated` packages) is no longer the active direction. The generated tier was abandoned in the source chat above. Prior state described the cockpit as verified end to end; that remains true as history, not as focus.
