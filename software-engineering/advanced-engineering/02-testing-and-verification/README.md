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
