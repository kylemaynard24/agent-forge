# Testing and Verification

**Category:** Advanced engineer track

## Intent

Confidence design, contract thinking, verification boundaries, and flake resistance.

## When to use

- you want stronger engineering judgment in testing and verification
- the high-level ideas make sense but the real-world execution still feels slippery
- you need repeatable habits rather than one-off heroics
- you want to practice under realistic constraints instead of reading principles passively

## What this area trains

- choosing the right boundary for each kind of confidence
- testing interfaces and invariants rather than trivia
- designing code so it can be verified sanely
- recognizing when a test suite is teaching versus merely counting

## Subtopics

- [01-unit-vs-integration-boundaries/](01-unit-vs-integration-boundaries/) — Choose the smallest trustworthy boundary for the question you need answered.
- [02-contract-testing/](02-contract-testing/) — Protect an interface between modules or services without booting the whole world.
- [03-property-based-testing/](03-property-based-testing/) — Test invariants over many generated inputs instead of a few named examples.
- [04-snapshot-testing-trade-offs/](04-snapshot-testing-trade-offs/) — Use snapshots where output shape matters, and reject them where they become noise.
- [05-flaky-test-diagnosis/](05-flaky-test-diagnosis/) — Find nondeterminism in tests before it poisons trust in the suite.
- [06-test-doubles/](06-test-doubles/) — Choose fakes, stubs, spies, or mocks deliberately instead of reflexively.
- [07-mutation-testing-mindset/](07-mutation-testing-mindset/) — Ask whether your tests would catch plausible wrong implementations.
- [08-testability-design/](08-testability-design/) — Shape code so important decisions are easy to observe and verify.

## What to notice as you work through it

- what exact question a test answers
- which boundary really owns the risk
- whether the check protects behavior or implementation detail
- how likely the test is to become noisy or brittle

## Common mistakes

- treating coverage as a confidence substitute
- testing through too many layers at once
- mocking so aggressively that the important behavior disappears
- keeping flaky tests around after trust is already damaged

## How to use the materials

Each subtopic folder contains:

1. **README.md** — the concept and trade-offs
2. **demo.js** — a tiny runnable illustration
3. **homework.md** — a constrained exercise

Run any demo with:

```bash
node path/to/demo.js
```

Start with the earlier folders before the later ones. The ordering is intentional.

## Scenario questions

These questions are meant to turn **Testing and Verification** into an operational instinct. Read them like incident prompts: what are you seeing, what move should happen next, and what mistake are you trying to avoid under pressure?

### Scenario 1 — "The system is noisy, stressful, and people want to skip straight to action"

**Question:** You are in the middle of a real engineering problem and the room wants to jump ahead before the situation is legible. Is this topic the kind of move that should slow people down and sharpen the next step?

**Answer:** Usually yes.

**Explanation:** This topic matters when disciplined engineering beats improvisation. The point is not process for its own sake. The point is to reduce confusion, make the next move more informed, and avoid creating a second problem while reacting to the first.

**Why not jump first to Debugging and Diagnostics or Performance and Capacity:** adjacent skills matter, but they often work best after **Testing and Verification** has made the problem clearer, safer, or more measurable.

### Scenario 2 — "A team keeps confusing activity with progress"

**Question:** An engineer says, "We're doing a lot already, so we must be handling this well." Does **Testing and Verification** help test whether the team is actually making the system easier to reason about?

**Answer:** Yes.

**Explanation:** Strong operational topics give you a quality bar for action. **Testing and Verification** is useful when you need to ask whether the current work is actually reducing uncertainty, restoring control, or increasing confidence instead of merely producing motion.

**Why not treat effort as evidence:** because under pressure, busy teams can still thrash. The value of **Testing and Verification** is that it gives you a sharper standard for what "better" looks like.
