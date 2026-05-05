# Homework — Query Optimization

> Reduce unnecessary work in the data path rather than hiding it with hardware.

## Exercise

Work through a small scenario involving an ORM query that creates an N+1 surprise.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Query Optimization felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Query Optimization without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Comments explain the why, performance tricks must be documented, readability is the default

An optimized query that fixes an N+1 pattern — a join replacing a loop, a subquery replaced by a CTE, a raw SQL bypass of the ORM — is often less readable than the naive version, and that is the moment a comment is not optional. The clean code rule that comments explain *why*, not *what*, applies directly: the comment above a clever query should state the original problem, the measured cost, and why the optimization is written the way it is.

**Exercise:** For the N+1 ORM scenario in this homework, write the optimized query and place above it a comment block that answers: what the original code was doing (describe the N+1 pattern), what the measured cost was at the workload that surfaced it, and what the optimized version gives up in terms of readability or flexibility. The comment should be thorough enough that a future engineer can decide whether to keep or revert the optimization when the access pattern changes.

**Reflection:** In a performance optimization you have written, did you leave a comment explaining why the code is structured the way it is — or does the optimized version look like clever code that the next engineer might "simplify" back into the slow version?
