# CAP and PACELC

**Category:** Cross-Cutting

## Intent

Reason about distributed-system trade-offs. **CAP**: in the presence of a network **P**artition, you must choose between **C**onsistency and **A**vailability — you cannot have both. **PACELC** completes the picture: even in the *absence* of a partition (**E**lse), you trade **L**atency vs. **C**onsistency. Every distributed datastore makes this choice; understand which one yours has made.

## When to use

- Choosing or evaluating a database, cache, or message broker.
- Designing replication for a stateful service.
- Writing post-mortems where "stale read" or "split-brain" are in the timeline.
- Setting product expectations: "is it OK if a user sometimes sees old data?"

## Trade-offs

**Pros**
- Forces an explicit, conscious choice instead of an accidental one.
- Aligns engineering with product: "do we need correct, or do we need available?"
- Helps explain confusing failure modes ("why did we serve stale data during the outage?")

**Cons**
- The model is reductive — real systems are tunable per-operation, not globally CP or AP.
- "Consistency" in CAP is **linearizability**, which is stricter than what most products call "consistency."
- "Availability" in CAP means *every* request gets a non-error response, not "the system is up."
- Some choices look like CP/AP but are actually neither under the strict definitions.

**Rule of thumb:** during a partition, decide *per request* whether stale-but-fast or correct-but-error fits the use case — and document it.

## Real-world analogies

- An ATM still letting you withdraw cash when offline (chose A) — the bank reconciles later.
- A flight-control system rejecting an instruction it cannot confirm with the redundant unit (chose C).
- A spreadsheet syncing across two laptops on the same plane Wi-Fi — when the connection blips, you can keep editing (A) or freeze the cell (C).

## Run the demo

```bash
node demo.js
```

The demo simulates two replicas. It introduces a partition, then runs the same read under a "CP" policy (return error rather than risk staleness) and an "AP" policy (return possibly-stale data) so you can see the trade-off concretely. It also shows the ELSE side: lower latency at the cost of weaker consistency.

## Deeper intuition

Cross-cutting concerns expose the pressures that ignore your clean boxes. Observability, trade-off analysis, distributed-systems fallacies, and CAP-style thinking all exist to remind you that runtime reality cuts across module boundaries and happy-path diagrams.

A strong grasp of **CAP and PACELC** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **CAP and PACELC** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Fallacies of Distributed Computing or Observability instead:** those may still matter, but **CAP and PACELC** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply CAP and PACELC everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **CAP and PACELC** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat CAP and PACELC as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
