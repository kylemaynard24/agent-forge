# Homework — Tail Latency

> Care about the slow worst-case requests that users actually remember.

## Exercise

Work through a small scenario involving a service whose average latency is fine but P95 is painful.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Tail Latency felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Tail Latency without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, precision over brevity, avoid ambiguity under pressure

Metric names are code that runs in dashboards and alerts, and they follow the same naming rules: a metric called `latency` is as useless under pressure as a variable called `data`. When an on-call engineer is staring at a spike at 2 a.m., `p99_checkout_latency_ms` immediately tells them the percentile, the operation, and the unit; `latency` forces a detour through documentation before any diagnosis can begin.

**Exercise:** For the service in this homework whose P95 is painful, write metric names for five latency measurements you would record. Each name must encode: the percentile, the operation being measured, and the unit. Then write the one-line alert expression for the P99 metric that would page on-call with enough context in the alert title — using only the metric name — to know which service and operation is degraded.

**Reflection:** In a production dashboard you monitor, if you covered the Y-axis and axis labels and saw only the metric names, could you still explain to a non-engineer what each chart is measuring and why it matters?
