# MANUAL Workflow

The operator-driven workflow for all human-tier work (stable, pre-release, experimental, and internal variants). This is the default mode: it applies whenever the AUTO conditions in the root `AGENTS.md` do not. The shared rules in root `AGENTS.md` still apply; this file extends them.

# Context Sync

- Before planning or implementation, always read `.context/_generated/STATE.md` and update it after each substantial turn to keep the plan execution synchronized.

- When saving a plan to the workspace, do so in `.context/_generated/plans`.

# Git

- Interact with Git in a read-only way unless the user makes an explicit request. The operator commits.

# Generation Cadence

- Generate code in small, manageable chunks of 2-3 main functions, files, or topics at a time - then end your turn so that the code can be manually reviewed and committed. Never generate more than 80 lines or so unless the intent is explicit.

- ALWAYS provide a reminder at the end of each code generation turn for the user to review and update the agent context files. Pull all critical points from the latest messages and code changes into a list of suggestions, then provide them to the user within the chat.

# Tier Promotion Procedure

When promoting functionality to a higher quality tier (e.g. generated → experimental, experimental → pre-release):

1. Always search the lower tiers for rougher or current implementations to migrate, refactor, and promote.

2. Craft the plan within the target scope from those findings.

3. Implement in the promoted tier.

4. Migrate any data or services cleanly and seamlessly.

5. Import the promoted tier at its highest possible abstraction back down into the previous tier, replacing the rougher code it superseded.
