# Load Balancing

**Category:** Resilience and Scale

## Intent

Distribute incoming work across a set of replicas so no single node is overloaded while others are idle. The two foundational strategies are **round-robin** (next request to next backend, in order) and **least-connections** (next request to the backend currently handling the fewest in-flight calls).

## When to use

- You run more than one replica behind a single virtual address.
- Per-request cost is variable — some are cheap, some are expensive.
- You want horizontal scale instead of (or in addition to) vertical scale.
- You need failover — bad backends must be removed from rotation.

## Trade-offs

**Pros**
- Round-robin: stateless, easy, fair when requests are uniform.
- Least-connections: adapts to heterogeneous request cost.
- Combined with health checks, gives automatic failover.
- The load balancer is a natural place for TLS termination, retries, and metrics.

**Cons**
- Round-robin is blind to backend load — one slow request can trail behind a fast pile.
- Least-connections needs accurate per-backend counters; under multiple LB instances, those counters disagree.
- Sticky sessions improve cache hit rate but defeat balance.
- The LB itself is a single point of failure if not made redundant.

**Rule of thumb:** start with round-robin; switch to least-connections when request cost varies a lot; add health checks before either.

## Real-world analogies

- A queue at the bank that feeds whichever teller opens up next.
- A taxi rank — the next car takes the next fare, but if a car gets stuck on a long ride, dispatch sends the next fare to a different one.
- Multiple checkout lines at a grocery store — staffed dynamically based on length.

## Run the demo

```bash
node demo.js
```

The demo simulates 100 requests of varying cost across 3 backends, comparing round-robin vs. least-connections. It prints per-backend total work and the wall-clock to drain the queue under each strategy.

## Deeper intuition

Resilience and scale topics teach you to design for bad days instead of ideal days. The mature question is not whether something can fail, but how failure is detected, bounded, retried, absorbed, or surfaced before it becomes systemic damage.

A strong grasp of **Load Balancing** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Load Balancing** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Rate Limiting or Retry and Timeout instead:** those may still matter, but **Load Balancing** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Load Balancing everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Load Balancing** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Load Balancing as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
