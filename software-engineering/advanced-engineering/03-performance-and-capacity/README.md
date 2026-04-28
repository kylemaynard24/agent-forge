# Performance and Capacity

**Category:** Advanced engineer track

## Intent

Measure real bottlenecks, then spend effort where it buys meaningful latency, throughput, or resource savings. Performance work is an evidence problem before it is an algorithm problem.

## When to use

- A workflow is slow and no one can agree why
- Capacity planning is guesswork
- Read-heavy or write-heavy paths behave differently at scale
- Caching helps one path while hurting another

## What this area trains

- profiling before optimizing
- understanding hot paths
- reasoning about latency budgets
- throughput versus tail latency trade-offs
- recognizing memory and cardinality blowups

## Trade-offs

**Pros**
- Higher leverage than random micro-optimizations
- Better prioritization because measurements anchor the work
- Stronger architecture decisions around scale

**Cons**
- Benchmarking can lie if the workload is unrealistic
- Optimizations often increase complexity
- Improvements in one metric can worsen another

## Rule of thumb

Never trust a performance conclusion without workload, measurement, and comparison. "Feels faster" is not data.

## Run the demo

```bash
node demo.js
```

The demo compares naive scanning with indexed lookup over the same data so the bottleneck and the measurement both stay visible.

See also: [homework.md](homework.md) and [project.md](project.md)
