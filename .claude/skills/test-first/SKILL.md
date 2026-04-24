---
name: test-first
description: Use when implementing new behavior or fixing bugs with reproducible symptoms. Writes a failing test before the implementation.
---

When the user asks for new behavior or a reproducible bug fix:

1. **Write the failing test first.** Run it and confirm it fails **for the right reason** (not a syntax error, not a missing import).
2. **Implement the smallest change that makes it pass.** No speculative generality, no drive-by refactors.
3. **If you want to refactor, do it in a separate step** after the test is green — never in the same commit as the fix.
4. **If you can't write a failing test first** (flaky system, env-specific, hard-to-automate UI), say so explicitly and describe the alternative verification you'll do.

Do NOT apply this skill to:
- Pure refactors (no behavior change intended)
- Docs-only changes
- Exploratory prototyping where the shape of the solution is still unclear
