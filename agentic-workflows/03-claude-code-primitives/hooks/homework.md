# Homework — Hooks

> Pick something that *must* happen and make it happen — not as a prompt, as a hook.

## Exercise 1: Identify a hook candidate

Find one behavior in your work that *should* happen but sometimes doesn't:
- "Run tests after edits to test files."
- "Lint before commits."
- "Block edits to migration files past a certain age."
- "Beep when Claude is waiting for input."
- "Log every Bash command Claude runs to a file."

Pick one where reliability matters. (Don't pick "always be helpful" — that's a prompt-shaped problem.)

## Exercise 2: Write the hook

Add it to your `settings.json` (project or user):

**Constraints:**
- The hook is **fast** — under 500ms in the common case.
- It has explicit error handling — failures don't break the harness.
- The matcher is precise — it fires only when relevant.
- It's documented inline (a comment in your settings or in a CHANGELOG) explaining why this is a hook and not a prompt.

## Exercise 3: Test the hook

Run Claude through scenarios that should trigger it. Verify:
- It fires every time. (If not, fix the matcher.)
- It fails gracefully. (Force an error case; ensure the harness doesn't get stuck.)
- It's fast enough that you don't notice it.

If the hook is slow, redesign — maybe it should run async with `&` or be replaced by a daemon.

## Stretch 1: A blocking hook

Write a hook that *blocks* a Claude action under specific conditions. Example: prevent edits to files matching a pattern, prevent Bash commands containing `rm -rf`, prevent commits without a JIRA ticket reference.

Test that the block works AND that Claude gets a useful error message (so it can adapt).

## Stretch 2: Compare hook vs prompt for the same behavior

Pick a behavior. Implement it twice:
1. As a system prompt rule ("always format after editing").
2. As a hook (`prettier --write`).

Run a 50-edit session under each. Count the times the behavior didn't happen as expected. Compare. The hook should be 0; the prompt should be ~3-10% drift.

## Reflection

- "Memory says remember; a skill says behave; a hook says enforce." Defend or refute this hierarchy.
- Why are hooks the right place for *security* policies and the wrong place for *style* preferences? (Hint: hooks are absolute; style preferences want flexibility.)
- A hook that runs every tool call adds latency. What's the rough ceiling before users notice? (Hint: <100ms is unnoticed; 500ms is annoying; 1s is infuriating.)

## Done when

- [ ] You have one real hook in your settings.
- [ ] You've tested it through both successful and failing scenarios.
- [ ] You can articulate why it's a hook and not a prompt.
- [ ] You've measured (or estimated) the latency it adds.

---

## Clean Code Lens

**Principle in focus:** Single Responsibility + Do One Thing

A hook that runs a formatter, then a linter, then a secret scanner in one script is three functions that happen to share a file: each has different triggering logic, different failure modes, and a different reason to change. Bundling them violates the single-responsibility principle in the same way a `validateAndSaveAndNotify()` function does — when the linter logic needs to change, you have to reason about the formatter and the scanner code at the same time.

**Exercise:** Take your hook and write a one-sentence responsibility statement for it starting with a single verb (e.g., "Blocks commits that lack a JIRA ticket reference"). If the statement requires "and" or "also", split the hook into two separate matchers in `settings.json`, each with its own narrow responsibility and its own failure handling.

**Reflection:** The homework asks you to document inline why this is a hook and not a prompt. What is the equivalent comment you'd write in code to explain why a particular check is a guard clause rather than a test — and what does that documentation practice tell you about how to make the system's enforcement boundaries legible to future maintainers?
