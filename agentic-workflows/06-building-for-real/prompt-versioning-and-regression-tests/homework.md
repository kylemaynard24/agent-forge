# Homework — Prompt Versioning and Regression Tests

> Version your prompts. Gate releases on evals.

## Exercise 1: Add versions

For an agent you're working on, give it a version. Pick a scheme (semver or date-based).

Each prompt artifact gets a version line and a CHANGELOG entry. Each agent run records `prompt_version` in its trace.

**Constraints:**
- The version is human-readable in 1 second.
- A change to ANY prompt block bumps the version.
- The CHANGELOG entry says: what changed, why, eval results.

## Exercise 2: A regression test

Build the loop:

1. Make a small prompt change (e.g., adding a constraint).
2. Run your eval suite (from `05-reliability-and-ops/evals-for-agents`) on both versions.
3. Compare pass rates per fixture.
4. If any fixture regressed, **decide and document**: accept, fix, revert.

**Constraints:**
- Both versions are run on the same fixtures.
- The decision is recorded in the CHANGELOG, not just done.
- A regression of 1+ fixtures requires a written justification or a fix.

## Exercise 3: A canary release flow

Implement (or sketch) a release flow:

1. Tag prompt v_new in dev.
2. Run evals; pass at parity or better.
3. Promote to staging — 5% of traffic.
4. Monitor production metrics (cost, latency, user feedback) for N days.
5. Promote to 100% or roll back.

For homework, you can do this on an agent in development without real "traffic" — but write it up as if you were rolling it out.

## Stretch: Bisect a regression

Make 3 prompt changes in a row (commits). Run evals after each. Plant a "bug" — one of the changes silently regresses an eval.

Then: starting from the last known-good version, bisect to find which commit introduced the regression. Just like `git bisect`.

## Reflection

- "Without versioning, every prompt edit is a coin flip." Argue this.
- An eval suite that doesn't catch your real-world regressions is performative. How do you know yours actually catches things? (Hint: introduce known regressions; verify the suite catches them.)
- Why is bundling unrelated prompt changes into one version a footgun? (Hint: bisect impossibility.)

## Done when

- [ ] Every prompt has an explicit version recorded with each agent run.
- [ ] You have a CHANGELOG with at least 3 entries.
- [ ] You've run evals on two prompt versions and compared.
- [ ] You can articulate a release flow appropriate for your scale.
