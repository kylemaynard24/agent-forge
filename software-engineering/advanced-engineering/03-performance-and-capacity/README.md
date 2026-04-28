# Performance and Capacity

**Category:** Advanced engineer track

## Intent

Measurement, bottleneck analysis, tail behavior, and capacity-aware design.

## When to use

- you want stronger engineering judgment in performance and capacity
- the high-level ideas make sense but the real-world execution still feels slippery
- you need repeatable habits rather than one-off heroics
- you want to practice under realistic constraints instead of reading principles passively

## What this area trains

- anchoring performance work in workload and measurement
- separating query-time cost from build-time or memory cost
- thinking in latency distributions instead of averages alone
- planning for load, backpressure, and degraded behavior

## Subtopics

- [01-profiling/](01-profiling/) — Measure where time or memory is actually going before changing code.
- [02-latency-budgets/](02-latency-budgets/) — Allocate response-time targets across a workflow before every dependency spends freely.
- [03-tail-latency/](03-tail-latency/) — Care about the slow worst-case requests that users actually remember.
- [04-caching-trade-offs/](04-caching-trade-offs/) — Speed up hot reads without lying to yourself about staleness and invalidation.
- [05-indexing/](05-indexing/) — Trade indexing cost and storage for faster lookup on important access paths.
- [06-query-optimization/](06-query-optimization/) — Reduce unnecessary work in the data path rather than hiding it with hardware.
- [07-queue-backpressure/](07-queue-backpressure/) — Protect the system when producers outpace consumers.
- [08-memory-leaks/](08-memory-leaks/) — Track references and allocations that survive longer than they should.
- [09-load-testing/](09-load-testing/) — Probe system behavior under increasing pressure before production does it for you.
- [10-capacity-planning/](10-capacity-planning/) — Estimate the next bottleneck before growth turns into surprise downtime.

## What to notice as you work through it

- where the hot path really is
- which metric is being improved and which is being harmed
- whether the workload matches production reality
- what breaks next at higher traffic or data volume

## Common mistakes

- optimizing cold paths because they look ugly
- benchmarking unrealistic toy cases and calling it done
- improving averages while tail latency gets worse
- ignoring memory, cardinality, or invalidation cost

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

These questions are meant to turn **Performance and Capacity** into an operational instinct. Read them like incident prompts: what are you seeing, what move should happen next, and what mistake are you trying to avoid under pressure?

### Scenario 1 — "The system is noisy, stressful, and people want to skip straight to action"

**Question:** You are in the middle of a real engineering problem and the room wants to jump ahead before the situation is legible. Is this topic the kind of move that should slow people down and sharpen the next step?

**Answer:** Usually yes.

**Explanation:** This topic matters when disciplined engineering beats improvisation. The point is not process for its own sake. The point is to reduce confusion, make the next move more informed, and avoid creating a second problem while reacting to the first.

**Why not jump first to Security and Trust Boundaries or Legacy Rescue and Refactoring:** adjacent skills matter, but they often work best after **Performance and Capacity** has made the problem clearer, safer, or more measurable.

### Scenario 2 — "A team keeps confusing activity with progress"

**Question:** An engineer says, "We're doing a lot already, so we must be handling this well." Does **Performance and Capacity** help test whether the team is actually making the system easier to reason about?

**Answer:** Yes.

**Explanation:** Strong operational topics give you a quality bar for action. **Performance and Capacity** is useful when you need to ask whether the current work is actually reducing uncertainty, restoring control, or increasing confidence instead of merely producing motion.

**Why not treat effort as evidence:** because under pressure, busy teams can still thrash. The value of **Performance and Capacity** is that it gives you a sharper standard for what "better" looks like.
