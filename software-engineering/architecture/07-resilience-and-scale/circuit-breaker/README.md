# Circuit Breaker

**Category:** Resilience and Scale

## Intent

Stop calling a downstream that is clearly broken. After **N** consecutive failures, **open** the circuit and fail fast for a cool-off window. Then **half-open** to probe recovery, and **close** again on success. The breaker protects the downstream from being hammered while it heals, and protects the caller from wasting time and resources on doomed calls.

## When to use

- A downstream dependency can fail hard for seconds or minutes (deploys, restarts, GC pauses).
- Your callers can degrade gracefully (cache, default, error message) when the dependency is unreachable.
- Pure retry-with-backoff is making the outage worse rather than better.
- You want to surface dependency health as an explicit signal.

## Trade-offs

**Pros**
- Fails fast — callers don't pile up on a dead downstream.
- Gives the downstream room to recover instead of beating it while it's down.
- Surfaces a clean health signal you can alert on.

**Cons**
- An open breaker means *every* caller sees errors, even if a few succeed.
- Tuning the thresholds is genuinely hard — too sensitive flaps; too lax never trips.
- Hides the underlying issue if you don't alert on `open` transitions.
- Per-instance state — without coordination, fleet behavior can be uneven.

**Rule of thumb:** retry handles blips, the breaker handles outages. Use both, in that order.

## Real-world analogies

- An electrical breaker that trips on overload, then can be reset.
- A bouncer who, after enough trouble, locks the door for ten minutes before peeking out.
- A 911 dispatcher who stops dialing a phone that hasn't rung through five times in a row.

## Run the demo

```bash
node demo.js
```

The demo wraps a flaky service in a breaker that opens after 3 consecutive failures, fails fast while open, transitions to half-open after a cool-off, and closes again on a successful probe.

## Deeper intuition

Resilience and scale topics teach you to design for bad days instead of ideal days. The mature question is not whether something can fail, but how failure is detected, bounded, retried, absorbed, or surfaced before it becomes systemic damage.

A strong grasp of **Circuit Breaker** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Circuit Breaker** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Bulkhead or Idempotency instead:** those may still matter, but **Circuit Breaker** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Circuit Breaker everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Circuit Breaker** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Circuit Breaker as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
