# advanced-engineering

A learning-oriented collection for the skills that separate a strong engineer from a merely well-read one.

This section picks up **after** the first three classes in the repo:

1. design patterns
2. architecture
3. agentic workflows

Those three teach you how to think about systems. This section teaches you how to **perform** when the system is slow, unsafe, broken, old, or on fire.

## Contents

- [01-debugging-and-diagnostics/](01-debugging-and-diagnostics/) — root-cause analysis, repro minimization, symptom triage
- [02-testing-and-verification/](02-testing-and-verification/) — test strategy, confidence, contract thinking, flake resistance
- [03-performance-and-capacity/](03-performance-and-capacity/) — profiling, bottlenecks, latency budgets, capacity thinking
- [04-security-and-trust-boundaries/](04-security-and-trust-boundaries/) — threat modeling, validation, auth, secrets, tenant safety
- [05-legacy-rescue-and-refactoring/](05-legacy-rescue-and-refactoring/) — seams, strangler moves, modernization without rewriting everything
- [06-incident-response-and-engineering-execution/](06-incident-response-and-engineering-execution/) — detection, mitigation, communication, postmortems, design docs

Each area now also contains a deeper subtopic ladder. Those subtopics are where the abstract skill turns into repeated practice.

## How to use this section

Each area has four artifacts:

1. **`README.md`** — the concept and why it matters
2. **`demo.js`** — a tiny runnable illustration
3. **`homework.md`** — a constrained exercise
4. **`project.md`** — a more realistic project brief

The right way to study this section is not to memorize best practices. It is to learn the operating habits behind them:

- gather evidence before changing code
- define the confidence you need before shipping
- measure before optimizing
- make trust boundaries explicit
- change old systems through seams, not heroics
- communicate clearly while pressure is rising

## How to know this section is working

You are getting value out of `advanced-engineering/` when you notice that you:

- debug faster because your hypotheses are narrower
- write fewer but better tests because you choose boundaries deliberately
- speak about performance with numbers instead of vibes
- see security risks while designing, not after the incident
- modernize systems incrementally instead of arguing for rewrites
- write cleaner incident notes, postmortems, and design docs

## How to run the demos

Each area includes a self-contained Node.js demo:

```bash
node path/to/demo.js
```

Any recent Node.js version works. The point of the demo is not completeness. The point is to make the shape of the engineering move obvious.
