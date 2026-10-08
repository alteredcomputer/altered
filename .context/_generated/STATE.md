# PLAN STATE (Generated)

Last updated: 2026-10-05

## Focus

Versioning certification (the Commit Covenant). Building the commit gate and merge gate in `@altered/tooling`, then running the genesis ritual so no file in the repo is tracked unless a human certified it.

## Resume here

- Chat to resume the CLI work from: Cursor conversation `b5f36806-90e5-4781-8765-635443049965`. Its full transcript is in this project's agent transcripts under that ID.
- Branch: `feat/versioning-certification`. Last commit `140457c`.
- **The latest chunk is uncommitted and only partly staged.** It is the single-hook restructure, the trailer dedup fix, and amend prefill. It typechecks and lints clean. Review, stage the rest, and commit it before starting anything new. The hook in the working tree is already live, so that commit will run through the new gate.
- Test after committing: `git commit --amend --no-edit` should offer the previous reasoning dimmed, Enter should keep it, and `git log -1 --format=%B` should show exactly one `Certification-Reasoning` then one `Certification-Signature`. `git commit --no-verify` should still be refused.

## Plan linkage

- Primary plan: `.context/_generated/plans/versioning-certification-covenant.md`
- Origin chat: Cursor conversation `b5f36806-90e5-4781-8765-635443049965`
- Source chat (idea, verbatim spec, wall roadmap Wave A item 3): `ea57fce1-6323-4513-86d9-711912e97371`, snapshot at `.context/strategy-generated/sources/gtm-master-chat.jsonl`

## Confirmed status

- `@clack/prompts@1.2.0` is a direct dependency of `@altered/tooling` plus a `catalog` entry.
- The commit gate is live and has certified its own commits. `fc37c43` is the first commit that passed through it.
- `core.hooksPath` is set to `.hooks` by the root `prepare` script, so every terminal commit goes through the gate.
- Escape hatch is `git -c core.hooksPath=/dev/null commit`. `--no-verify` no longer bypasses the gate.
- The gate is one `prepare-commit-msg` hook calling `packages/tooling/bin/versioning/certify-commit.ts` by path. `pre-commit`, `commit-msg`, the handoff state file, and the old bins are deleted, and hook entrypoints have no `bin` entry in the manifest.
- Verified empirically on git 2.51: `prepare-commit-msg` runs and can abort under `--no-verify`, merges arrive with source `merge`, and amends arrive with source `commit` and the previous message still in the file.
- Certification is recorded as `Certification-Reasoning` then `Certification-Signature`. Existing certification trailers are stripped before rewriting, because `interpret-trailers --if-exists replace` removes only one prior occurrence per key. Verified against the real duplicated message on `140457c`, which stays duplicated as a historical checkpoint.
- Amending prefills the reasoning from the existing trailer as a dimmed default. Verified the read; the prompt itself needs an operator at a terminal.
- Non-terminal runs refuse and exit 1 with a stated reason. Verified from an agent shell.
- Husky and lefthook declined; reasoning is in the plan's Hooks section.
- Tier and code-scope detection cut entirely. Grade and tier language lives only in the prompt copy.

## Open issues

Both are recorded with examples in the plan's Known holes section.

1. **Amend shows a partial file list.** On an amend the frame lists only newly staged files, not everything the rewritten commit contains. Fix: also list `HEAD`'s files when amending. Catches: `-c` and `-C` reuse look identical to an amend from the hook's point of view, and amending a repo's first commit has no parent to diff against.
2. **Editor commits show trailers before you write the message.** Only without `-m`. The editor opens with trailers already at the top, and you type the subject above them. The final commit is correct.

## Next

1. Commit the uncommitted chunk above.
2. Branch `feat/versioning-certification`: the bypass lane (`stash/`, `archive/`), then the merge gate. The `post-commit` tripwire is now close to redundant and may be dropped.
3. Branch `refactor/certification-genesis`: `git rm -r --cached .`, tag `covenant/genesis`, then re-add the tree in certified chunks.
4. `AGENTS.md` covenant section, written by the operator: agents never commit, never disable hooks via `core.hooksPath`, and never type the operator's signature.

## Superseded

- Wave 0 generated-tier focus (Raycast internal cockpit, `*-generated` packages) is no longer the active direction. The generated tier was abandoned in the source chat above.
