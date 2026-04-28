# Project — Capacity Review

## Goal

Take one meaningful workflow and turn it into a **performance case study** with measurements, bottlenecks, and a scaling plan.

## Suggested domains

- feed generation
- leaderboard lookup
- search suggestions
- queue workers
- analytics aggregation

## Deliverables

1. A workload description
2. A benchmark harness or repeatable measurement script
3. One optimization with before/after numbers
4. A capacity note for 10x growth
5. A trade-off section covering latency, cost, and complexity

## Constraints

- One section must explain why a tempting optimization was rejected
- One section must mention degraded-mode behavior at higher load
- If you add caching, you must discuss invalidation or staleness honestly

## Done when

- [ ] Someone else could rerun your measurements
- [ ] Your chosen optimization clearly matches the bottleneck
- [ ] The scaling note is explicit about what breaks next
