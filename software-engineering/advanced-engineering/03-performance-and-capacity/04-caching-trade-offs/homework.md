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
