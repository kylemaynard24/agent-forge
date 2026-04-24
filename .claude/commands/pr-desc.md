---
description: Draft a PR description from the current branch's git state
---

Read the git state for this branch vs. main:

1. `git log main..HEAD --oneline`
2. `git diff main...HEAD --stat`
3. `git diff main...HEAD` — skim for anything non-obvious

Produce:

**## Summary**
1–3 bullets on what changed and **why**. Every claim must be grounded in the actual diff.

**## Test plan**
A markdown checklist a reviewer can run through.

Do not invent features or motivations that aren't visible in the diff. If the branch is trivial, say so — don't pad.
