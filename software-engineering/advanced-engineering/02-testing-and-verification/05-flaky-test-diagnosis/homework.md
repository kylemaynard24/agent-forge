# Homework — Flaky Test Diagnosis

> Find nondeterminism in tests before it poisons trust in the suite.

## Exercise

Work through a small scenario involving a CI-only test that fails once every twenty runs.

**Build:**
- one small verification target
- at least two different boundary choices
- a note explaining why one boundary is the better fit

**Constraints:**
- each check must answer one clear question
- at least one boundary choice must be justified in writing
- you must name one low-value test idea and reject it

## Reflection

- What part of Flaky Test Diagnosis felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Flaky Test Diagnosis without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Make dependencies explicit, single responsibility, avoid hidden coupling

A flaky test is almost always a test with hidden dependencies — timing, shared state, execution order, or an implicit environmental assumption that was never declared. The same clean code instinct that says "pass your dependencies explicitly rather than reaching for globals" applies directly: a test that names and injects every dependency it needs (clock, random seed, database state, file system) cannot be made flaky by invisible environmental variation.

**Exercise:** For the CI-only flaky test scenario, list every dependency the test could possibly have — explicit and implicit. Mark each one as "named" (passed in or clearly declared) or "hidden" (assumed from the environment, test order, or setup method side effects). Then rewrite the test so every hidden dependency becomes named, and explain how the rewrite would have made the flakiness visible immediately rather than after twenty runs.

**Reflection:** In a flaky test you have encountered, was the nondeterminism caused by an implicit dependency that clean code practices — explicit injection, avoiding shared mutable fixtures — would have made impossible to introduce?
