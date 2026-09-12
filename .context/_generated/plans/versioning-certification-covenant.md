# Plan: Versioning Certification (the Commit Covenant)

Two interactive gates in `@altered/tooling` under `src/versioning/`. The commit gate blocks uncertified commits at the terminal. The merge gate refuses to integrate a branch containing unsigned commits. Then a genesis ritual untracks every file so the entire tree must be re-added through the gate.

The mechanism is conceptual. No gate inspects diff contents for correctness. The commit gate protects lines, the merge gate protects history.

## Provenance

- Origin chat (this plan): Cursor conversation `b5f36806-90e5-4781-8765-635443049965`.
- Source of the idea, verbatim spec, and the wall roadmap that scopes it as Wave A item 3: Cursor conversation `ea57fce1-6323-4513-86d9-711912e97371`, snapshotted at `.context/strategy-generated/sources/gtm-master-chat.jsonl`.

The operator's original words, which the prompt copy compresses rather than quotes:

> "It needs some sort of code signing or lint step that asks you to confirm if you truly want to commit this... I need to sign a literal agreement to myself every time I merge a branch or even make a commit... 'I certify that I'm in a good state of mind to commit this code. I certify that this code will be the source of truth for all of my app data and all of my users and everything built on top of it for the tier I'm adding it to.'"

## Sequencing

Two branches, in order. The second one is what gives the first one substance.

1. `feat/versioning-certification` - build the gates, hooks, and config. These commits cannot be certified, because the gate does not exist yet while they are being written.
2. `refactor/certification-genesis` - the genesis ritual. Untrack everything and re-add the whole tree through the live gate, including the gate's own source.

That ordering resolves the irony in the source chat, that whoever writes the hook writes it uncertified. The ritual re-adds the tooling under the covenant, so the gate's first certified commit is the operator's.

## Architecture

The commit gate carries zero history awareness. The merge gate scans `main..HEAD`, a range that is naturally bounded and never walks pre-genesis history, so the chain rule lives in exactly one place.

- **Commit gate:** do I understand these lines? Per commit.
- **Merge gate:** do I understand this feature on top of main as it stands, and is every commit in it signed? Per integration.

That split also absorbs the rebase, conflict, and replay cases without extra machinery.

## Layout

- `packages/tooling/src/versioning/certification/` - shared: `config.ts`, `copy.ts`, `facts.ts`, `git.ts`, `trailers.ts`
- `packages/tooling/src/versioning/commits/` - the commit gate
- `packages/tooling/src/versioning/merges/` - the merge gate
- `packages/tooling/bin/certify-commit.ts` -> bin `altered-certify-commit`
- `packages/tooling/bin/certify-merge.ts` -> bin `altered-certify-merge`, aliased as root script `pnpm merge`
- `.hooks/pre-commit`, `.hooks/commit-msg`, `.hooks/post-commit`

`@clack/prompts@1.2.0` becomes a direct dependency of `@altered/tooling` plus a `catalog` entry in `pnpm-workspace.yaml`. It is already resolved in `node_modules` transitively through ultracite. Swap to hand-built `@clack/core` renderers later if the defaults grate.

## Config

Single typed module at `src/versioning/certification/config.ts`:

- `certificationAllowedSigners: ["RILEY BARABASH"]` - the typed signature must match one exactly, case sensitive.
- `certificationBypassBranchPrefixes: ["stash/", "archive/"]` - exception lanes.
- `minimumCommitReasoningLength` - the floor on the reasoning text.
- `pendingCertificationFileName` - carries answers from `pre-commit` to `commit-msg`, which are separate processes.

No tier or code-scope awareness. The gate does not detect, map, or validate anything about what the code is. Tier and grade language exists only in the prompt copy, where it belongs: if comprehension is honest, the operator already knows which tiers the commit touches, and any machine-derived answer would just be a second source of truth waiting to go stale.

## Hooks

Tracked `.hooks/` plus a root `prepare` script running `git config core.hooksPath .hooks`. Chosen over husky, which installs a `_/` runtime layer, rewrites hooks on install, and carries its own lifecycle, in exchange for auto-install on clone that the `prepare` script already provides.

Every hook starts with `exec < /dev/tty`. This is not agent detection. It is refusal of fabricated input: without it, `printf 'c\nb\n...' | git commit` answers every prompt. Verified empirically that an agent shell has no usable `/dev/tty` (`tty` reports "not a tty", opening the device fails with "device not configured"). The accepted side effect is that GUI commits, including Cursor's Source Control panel, cannot commit. Terminal only.

- `pre-commit` - the gate. Writes answers to `.git/covenant-pending.json`.
- `commit-msg` - appends trailers via `git interpret-trailers --in-place`, then deletes the pending file.
- `post-commit` - tripwire. `--no-verify` skips pre-commit and commit-msg but not post-commit, so this is where a bypassed commit gets caught. It cannot block and must never rewrite history. It prints a loud unsigned warning naming the commit.

## Commit gate sequence

Frame, then seven prompts. Every `select` defaults to the blocking option, so a blind Enter blocks. Question order is fixed and intentional: interrogate the code, then the person, then take the oath. Answer order within a question may shuffle to prevent muscle memory.

**0. Frame.** Branch and the staged file paths. No line counts, they measure nothing worth remembering.

**1. `COMPREHENSION >>> Do you understand every line staged here?`**

- No. I did not write or read this code. *(default, blocks: "Then it is not yours. Read it or drop it.")*
- Partially. I need it committed for a deploy, another machine, or a deadline. *(blocks, with the note below)*
- Yes. I wrote or read every line, and I know what it touches.

The partial answer prints a note before exiting: the pressure that produced it is a workflow defect, not a commit problem, and the fix belongs upstream.

**2. `QUALITY CONTROL >>> Does the code meet the standards set for its designated quality grade or release tier?`**

- No. The code needs to be changed. *(default, blocks: "Then change it. The tier is a promise, not a label.")*
- Yes. The code passes all requirements for its designated tier.

**3. `INTENT >>> What is this code doing to the codebase?`**

- Excessive. Accessory code that moves no lever and adds debt. *(default, blocks: "Cut it, or park it on an archive branch.")*
- Optimal. More than is needed now, for a mission-critical reason.
- Minimal. The least code that moves the target.

**4. `MINDSET >>> What are you operating from?`**

- Rushed. Trading precision for speed. *(default, blocks)*
- Tired. Depleted in body, mind, or spirit. *(blocks)*
- Disrupted. Angry, anxious, or otherwise unfit. *(blocks)*
- Misaligned. Building from obligation or outside pressure. *(blocks)*
- Focused. Certain, directional, grounded.

Block copy: "Nothing here expires tonight. Come back grounded."

**5. `REASONING >>> Why does this commit exist?`** Free text, minimum length only.

**6. `SOURCE OF TRUTH >>> Everything stands on this. Your users, your company, your life, and every tier beneath it. Accept it?`** Confirm, defaults to no.

**7. `SIGNATURE >>> Type your signature to certify every answer above.`** Case-sensitive match against `signatories`. Rejection copy: "Signature rejected."

## Bypass lane

On a branch matching `bypassBranchPrefixes`, the frame prints first, then one prompt:

**`BYPASS >>> Commit without certifying?`**

- No. Abort. *(default)*
- Yes. Commit uncertified.
- Certify instead. *(runs the full sequence)*

Bypassed commits get no trailers. Absence of `Covenant-Signature` is the definition of uncertified, so nothing extra needs recording.

## Trailers

Two keys, appended as the final paragraph, which git separates with a blank line automatically:

```
Covenant-Signature: RILEY BARABASH
Covenant-Reasoning: Splits the certification config out so the merge gate can share it.
```

Author, tier, mindset, comprehension, and intent are deliberately dropped. Author is already in git, and the others each have exactly one passing value, so recording them is noise. Only the signature and the reasoning carry information. The keys stay plaintext and greppable for later backwards inspection.

## Merge gate

`pnpm merge`, run from the feature branch.

1. **Backwards check.** Scan `main..HEAD` for commits missing `Covenant-Signature`, excluding the commit tagged `covenant/genesis`. Any hit aborts with the squash recovery recipe. This is the entire "no clean on top of slop" rule, in one command.
2. **Frame.** Branch, commit count, and the full list of file paths touched across the branch.
3. **`INTEGRATION >>> Do you understand this feature as one whole, on top of main as it stands now?`**
4. **`FIT >>> Does this belong in main right now?`**
5. **`REASONING >>> What does this feature do, in one sentence?`**
6. **`SIGNATURE >>>`**
7. `git merge --no-ff` carrying the trailers on the merge commit, then delete the branch, then push main.

`--no-ff` over `--ff-only` because a fast-forward creates no commit, and the merge commit is the only place a feature-level certification can live. It also marks the feature boundary in history. Rebase onto main first if the underlying commits should be linear.

## Integration recipes

**Certified branch, clean.** `git rebase main`, then `pnpm merge`.

**Certified branch, conflicts.** Rebase, resolve, then `pnpm merge`. Conflict resolutions are new code that was never certified per commit, and the merge gate is where that gets certified, because it reads the integrated result. A stricter mode flagging conflict-touched commits individually is deferred.

**Uncertified or pre-genesis branch.** Do not merge it. Take the changes without the history:

```bash
git switch main
git switch -c feat/x-recertified
git merge --squash feat/x
git reset
```

`git merge --squash` applies every change from the branch into the working tree and index, then stops without committing. No history is imported. `git reset` unstages so the work can be staged and committed in as many certified chunks as wanted. Conflicts surface once, in the working tree, before any commit exists, which is why this dissolves the "certified commit on an uncertified base" problem instead of solving it.

**Reviewing a branch as working changes**, non-destructive:

```bash
git switch -c review/feat-x main
git merge --squash feat/x   # the whole branch appears as staged changes
git reset                   # now plain unstaged changes, readable in the editor
git switch feat/x && git branch -D review/feat-x   # undo, zero risk
```

Full-branch diff with no branch juggling: `git diff main...feat/x`.

## Genesis ritual

The point is substance: after this, no file in the repo is tracked unless a human certified it.

Run it on `refactor/certification-genesis`, never on `main`. On a branch, nothing breaks: production deploys from main, per-branch preview deploys are off, and the working tree is never touched by any step, so abandoning midway costs nothing.

```bash
git switch main && git pull
git switch -c refactor/certification-genesis
git rm -r --cached .
git commit --no-verify -m "genesis: untrack everything, working tree intact"
git tag -m "certification begins here" covenant/genesis
git push origin covenant/genesis
```

The genesis commit is created with `--no-verify` because the gate's questions do not apply to it, and the tag is what marks where signature checks begin. `-m` implies `-a`, so no editor opens.

Every file then reappears as untracked, and re-adding is the work. Because the tree was untracked first, each re-add renders as pure additions in the diff, so the comprehension question is answered against every line rather than against a patch.

Suggested chunk order, coarse to fine, so context builds before detail: root configuration, then `packages/tooling` including the covenant itself, then packages by tier, then apps, then `.context` and `.agents`. Each chunk is `git add <paths>` followed by a normal `git commit` through the gate.

Rules for the ritual:

- Freeze all other work on main until it merges. Long-lived plus everything-touched equals guaranteed conflicts.
- Do not merge until the re-add is complete. A half-finished ritual on main is a repo with missing files.
- Timebox it. Two failure modes were already identified in the source chat: it becomes archaeology, and "I understand it" quietly mutates into "it is perfect." The covenant is about comprehension, not perfection. Rough and understood is certifiable.
- Anything not worth re-reading does not get re-added. Deletion is a valid outcome of this ritual and probably the most valuable one.

## Known holes

- `--no-verify` cannot be disabled. Git has no config that forces hooks. The post-commit tripwire announces it, and the merge gate refuses it. Commits made directly to main with `--no-verify` are caught only by the tripwire.
- `git rebase`, `cherry-pick`, and `revert` create commits through git's sequencer, which does not run `pre-commit` or `commit-msg`. Trailers survive rebase, so certified commits stay certified through a replay. Anything the sequencer creates fresh, such as a revert, comes out unsigned and the merge gate rejects it. When a rebase or cherry-pick stops on a conflict and is finished with `git commit`, the hooks run normally.
- The signature is a semantic boundary, not a cryptographic one. SSH commit signing with a Touch ID backed key is the git-native upgrade and needs no gpg, which is not installed on this machine.

## Direct commits to main

Allowed, and certified like any other. A `package.json` tweak does not need a branch, and the covenant already supplies the justification a PR used to.

## Deferred

- Tier and code-scope detection, as an opt-in plugin rather than core: derive the tiers a commit touches from the workspace names in the staged paths and surface them in the frame. Only worth it if the generalized copy proves too easy to answer on autopilot.
- CI verification job and a GitHub ruleset. With local merges and direct commits to main, GitHub is a mirror. Revisit if a second machine or contributor appears.
- Conventional commit enforcement. Branch names and commit messages stay uncontrolled; only bypass prefixes are interpreted.
- Re-certifying an already-committed bad commit in place, by plucking its changes back into the working tree and replaying everything ahead of it.
- Multiple tiers in a single commit or branch. Currently allowed.
- Reasoning validation beyond minimum length, including duplicate detection against the previous commit.
- Custom `@clack/core` renderers for a monochrome brutalist frame, and a rotating tenet line in the frame. Tenets do not exist as a tracked file yet and would need authoring.
- A scrollable full-branch diff review command.
- `AGENTS.md` section stating that agents never commit, never pass `--no-verify`, and never type the operator's signature. Draft it for operator review; the file is on the modification blacklist.
