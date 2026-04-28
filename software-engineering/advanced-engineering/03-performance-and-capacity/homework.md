# Homework — Performance and Capacity

> Measure the hot path before optimizing it.

## Exercise: Improve one real bottleneck

**Scenario:** A small service has one slow read path and one slow write path. Engineers keep suggesting caches, indexes, and async queues without agreement on the actual bottleneck.

**Build:**
- A baseline measurement for both paths
- One profiling or instrumentation pass
- One change that improves the slowest path
- A before/after summary with trade-offs

**Constraints:**
- You must measure before changing code
- You may not claim improvement without numbers
- At least one metric besides raw latency must be considered: memory, CPU, throughput, or complexity
- You must state what workload the numbers represent

## Stretch

Compare P50 and P95 rather than only average latency. Explain why tail behavior matters operationally.

## Reflection

- What looked expensive but was not?
- What hidden cost did the optimization introduce?
- Would this optimization still be worth it at 10x traffic?

## Done when

- [ ] You have a clear baseline
- [ ] You improved a real bottleneck, not a guessed one
- [ ] The write-up includes both gain and cost
