# Homework — Caching Trade-offs

> Speed up hot reads without lying to yourself about staleness and invalidation.

## Exercise

Work through a small scenario involving a dashboard query repeated constantly with mostly stable data.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Caching Trade-offs felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Caching Trade-offs without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, encode intent and constraints, make trade-offs visible

Cache variable names are one of the few places in code where the operational contract — scope, TTL, invalidation strategy — can be encoded directly in the identifier. A field named `cache` is an invitation to misuse; a field named `userProfileCache_5min` or `dashboardSummaryCache_invalidatedOnWrite` tells every reader exactly what staleness they are accepting and narrows the search space when stale data causes a bug.

**Exercise:** For the dashboard query scenario in this homework, define a cache variable name that encodes: what is cached, the TTL or invalidation trigger, and the scope (per-user, per-tenant, global). Then write the three-line code comment that would appear above the cache declaration explaining: why this data is safe to cache at this TTL, which write operations invalidate it, and what the observable consequence of stale data would be for the user.

**Reflection:** In a caching layer you have worked with, were the TTL and invalidation strategy documented at the declaration site — or were they only discoverable by tracing every write path and every cache population call?
