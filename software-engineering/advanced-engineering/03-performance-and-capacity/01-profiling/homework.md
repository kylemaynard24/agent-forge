# Homework — Profiling

> Measure where time or memory is actually going before changing code.

## Exercise

Work through a small scenario involving a request path that feels slow but has several plausible hotspots.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Profiling felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Profiling without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, document the context, avoid magic numbers

A profiling result is only useful if the context that produced it is recorded alongside it — a note that says "it was slow, we fixed it" is the documentation equivalent of a variable named `x`: it records that something happened but gives no basis for future decisions. The profiling data, the workload shape, the environment, and the baseline measurement together form the specification for the optimization.

**Exercise:** Write the profiling documentation for the slow request scenario in this homework as if it were a code comment that will live permanently next to the optimized code. It must name: the measurement tool used, the workload that exposed the hotspot (concurrency, data size, request rate), the specific function or query that dominated the flame graph, and the baseline number before any change. Then ask whether a future engineer reading only that comment could reproduce the measurement — and revise until the answer is yes.

**Reflection:** In a performance improvement you have made, could the next engineer who touches that code reproduce your profiling baseline from the documentation you left — or would they have to start from scratch?
