# Homework — Queue Backpressure

> Protect the system when producers outpace consumers.

## Exercise

Work through a small scenario involving a worker system that accepts jobs faster than it can finish them.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Queue Backpressure felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Queue Backpressure without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, encode consequences in names, replace magic numbers with named constants

Backpressure configuration values are policy decisions with visible operational consequences, and their names should make both the limit and the consequence explicit. `queueMax = 1000` is a magic number; `MAX_QUEUE_DEPTH_BEFORE_SHED = 1000` names the threshold, the direction of the comparison, and what happens when it is crossed — all from the identifier alone, before reading a single line of the logic that uses it.

**Exercise:** For the worker system scenario in this homework, define named constants for every backpressure threshold you would configure. Each name must encode: what resource is being limited, the unit or scale, and the consequence when the limit is hit (shed, pause, reject, alert). Then write a one-sentence operational runbook entry for each constant that explains to an on-call engineer what to do when the corresponding metric hits its threshold.

**Reflection:** In a queue-based system you operate, are the depth limits, timeout values, and retry counts named in a way that tells an on-call engineer what behavior to expect when each limit is reached — or are they tuned numbers whose meaning is hidden in code that may not run until the system is already degraded?
