# Homework — Latency Budgets

> Allocate response-time targets across a workflow before every dependency spends freely.

## Exercise

Work through a small scenario involving an API endpoint with too many sequential downstream calls.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Latency Budgets felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Latency Budgets without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Replace magic numbers with named constants, reveal intent

A latency budget encoded as a raw number (`if (elapsed > 200)`) is a magic number: it is present, it enforces something, but it communicates nothing about what user experience it is protecting or why that threshold was chosen. Replacing it with `MAX_CHECKOUT_LATENCY_MS = 200` or `PAYMENT_SERVICE_BUDGET_MS = 80` makes the contract visible in the code and makes a future change to the threshold an explicit, searchable, reviewable decision.

**Exercise:** For the multi-call API endpoint scenario in this homework, define named constants for each sub-call's latency allocation — not just the total budget. Each constant name should encode: the operation it bounds, the unit (ms), and the layer or service it applies to (e.g., `MAX_INVENTORY_CHECK_MS`, `MAX_PAYMENT_AUTH_MS`). Then write a single assertion or guard in the code path that fails loudly — not silently degrades — when any sub-budget is exceeded in a non-production environment.

**Reflection:** In an API you own, are the latency thresholds in your alerts and circuit breakers named after the user-facing SLA they are protecting — or are they tuned numbers that only the original author understands?
