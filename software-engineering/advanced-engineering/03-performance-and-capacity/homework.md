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

---

## Clean Code Lens

**Principle in focus:** Don't optimize prematurely, name your intent, make trade-offs visible

Premature optimization is a clean code violation because it trades readability for a performance gain that was never measured — the code becomes harder to understand in service of a problem that may not exist. When you do optimize a real bottleneck, the optimization deserves the same naming discipline as any other change: a function called `fetchOrdersWithEagerLoadedItems` tells the reader why it is written the way it is, while `fetchOrders2` hides the intent and the cost.

**Exercise:** For the bottleneck you improve in this homework, write a code comment — at most three sentences — that explains: what the original code did, why it was slow under the measured workload, and what trade-off the optimized version makes. Then evaluate whether the optimized function or query name alone (without the comment) communicates that a performance trade-off was made, and revise the name if it does not.

**Reflection:** In a performance optimization you have shipped, was the trade-off (readability sacrificed, complexity added, staleness introduced) documented in the code — or was it only visible in the commit message that most engineers will never read?
