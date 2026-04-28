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
