# PLAN STATE (Generated)

Last updated: 2026-08-21

## Focus

Versioning certification (the Commit Covenant). Building the commit gate and merge gate in `@altered/tooling`, then running the genesis ritual so no file in the repo is tracked unless a human certified it.

## Plan linkage

- Primary plan: `.context/_generated/plans/versioning-certification-covenant.md`
- Origin chat: Cursor conversation `b5f36806-90e5-4781-8765-635443049965`
- Source chat (idea, verbatim spec, wall roadmap Wave A item 3): `ea57fce1-6323-4513-86d9-711912e97371`, snapshot at `.context/strategy-generated/sources/gtm-master-chat.jsonl`

## Confirmed status

- No git hooks exist in the repo yet (`.git/hooks` is all `.sample`).
- `@clack/prompts@1.2.0` is now a direct dependency of `@altered/tooling` plus a `catalog` entry.
- The commit gate is live and has certified its own commits. `fc37c43` is the first commit that passed through it.
- `core.hooksPath` is set to `.hooks` by the root `prepare` script, so every terminal commit goes through the gate. Escape hatch is `git commit --no-verify`.
- `commit-msg` records the certification as `Covenant-Signature` and `Covenant-Reasoning` trailers, then deletes the handoff state. Verified the `interpret-trailers` invocation and the uncertified path, which leaves the message untouched and exits 0.
- Non-terminal runs refuse and exit 1 with a stated reason instead of hanging on an invisible prompt. Verified from an agent shell.
- Husky and lefthook declined. Husky's mechanism is the same `core.hooksPath` this already uses. Reasoning is in the plan's Hooks section.
- Tier and code-scope detection was cut entirely. Grade and tier language lives only in the prompt copy. Deferred as an opt-in plugin.

## Next

1. Branch `feat/versioning-certification`: the bypass lane and the `post-commit` tripwire, then the merge gate.
2. Branch `refactor/certification-genesis`: `git rm -r --cached .`, tag `covenant/genesis`, then re-add the tree in certified chunks.

## Superseded

- Wave 0 generated-tier focus (Raycast internal cockpit, `*-generated` packages) is no longer the active direction. The generated tier was abandoned in the source chat above. Prior state described the cockpit as verified end to end; that remains true as history, not as focus.
