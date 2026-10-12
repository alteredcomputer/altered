# PLAN STATE (Generated)

Last updated: 2026-10-07

## Focus

Versioning certification (the Commit Covenant). Building the commit gate and merge gate in `@altered/tooling`, then running the genesis ritual so no file in the repo is tracked unless a human certified it.

## Resume here

- Branch: `feat/versioning-certification`. Last commit `17fab5a`, the single-hook restructure, certified and amend-tested by the operator.
- **Uncommitted chunk:** full amend file list, amend detection from Git's process arguments, reasoning prefill read from `HEAD`, the editor refusal, the empty-paths note, and the detached-HEAD title. Typechecks and lints clean. Context and trailer reads verified in a scratch repo across every commit variant. The prompts themselves still need an operator at a terminal.
- Operator tests after committing: `git commit --amend --no-edit` and `git commit --amend -m "..."` should both title `AMENDING`, list all 23-ish files of the amended commit, and prefill the reasoning. Plain `git commit` should refuse before any prompt.

## Plan linkage

- Primary plan: `.context/_generated/plans/versioning-certification-covenant.md`
- Origin chat: Cursor conversation `b5f36806-90e5-4781-8765-635443049965`
- Source chat (idea, verbatim spec, wall roadmap Wave A item 3): `ea57fce1-6323-4513-86d9-711912e97371`, snapshot at `.context/strategy-generated/sources/gtm-master-chat.jsonl`

## Confirmed status

- `@clack/prompts@1.2.0` is a direct dependency of `@altered/tooling` plus a `catalog` entry.
- The commit gate is live and has certified its own commits. `fc37c43` is the first commit that passed through it.
- `core.hooksPath` is set to `.hooks` by the root `prepare` script, so every terminal commit goes through the gate.
- Escape hatch is `git -c core.hooksPath=/dev/null commit`. `--no-verify` no longer bypasses the gate.
- The gate is one `prepare-commit-msg` hook calling `packages/tooling/bin/versioning/certification/commit.ts` by path. `pre-commit`, `commit-msg`, the handoff state file, and the old bins are deleted, and hook entrypoints have no `bin` entry in the manifest.
- Verified empirically on git 2.51: `prepare-commit-msg` runs and can abort under `--no-verify`, merges arrive with source `merge`, and amends arrive with source `commit` and the previous message still in the file.
- Certification is recorded as `Certification-Reasoning` then `Certification-Signature`. Existing certification trailers are stripped before rewriting, because `interpret-trailers --if-exists replace` removes only one prior occurrence per key. Verified against the real duplicated message on `140457c`, which stays duplicated as a historical checkpoint.
- Amends are detected from the Git process's own arguments (`ps` on the hook's `$PPID`), because the hook's source argument is `message` for `--amend -m` and `commit` for both `--amend --no-edit` and `-c`/`-C`. Known edges: a message containing a standalone `--amend` token is a false positive, and an alias hiding the flag is a false negative.
- Amending lists everything the rewritten commit contains (index diffed against the amended commit's parent, or the empty tree for a root commit), and prefills the reasoning from `HEAD`'s trailer, so `--amend -m` keeps the default too.
- Commits that would open an editor are refused before any prompt. Git sets `GIT_EDITOR=:` for hooks whenever no editor will open.
- Non-terminal runs refuse and exit 1 with a stated reason. Verified from an agent shell.
- Husky and lefthook declined; reasoning is in the plan's Hooks section.
- Tier and code-scope detection cut entirely. Grade and tier language lives only in the prompt copy.

## Open issues

- Long paths wrap mid-segment in narrow terminals (`@todo P3` in the gate).

## Next

1. Commit the uncommitted chunk above, then run the operator tests.
2. Branch `feat/versioning-certification`: the bypass lane (`stash/`, `archive/`), then the merge gate. The `post-commit` tripwire is now close to redundant and may be dropped.
3. Branch `refactor/certification-genesis`: `git rm -r --cached .`, tag `covenant/genesis`, then re-add the tree in certified chunks.
4. `AGENTS.md` covenant section, written by the operator: agents never commit, never disable hooks via `core.hooksPath`, and never type the operator's signature.

## Superseded

- Wave 0 generated-tier focus (Raycast internal cockpit, `*-generated` packages) is no longer the active direction. The generated tier was abandoned in the source chat above.
