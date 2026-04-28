# CQRS — Command Query Responsibility Segregation

**Category:** Communication

## Intent
Split your model in two: a **write side** that handles commands and produces events, and a **read side** that maintains denormalized projections optimized for queries. The two sides have different shapes, different scaling characteristics, and often different storage.

## When to use
- Read and write workloads are wildly asymmetric (10,000:1 reads vs writes — typical).
- A single normalized schema cannot serve both transactional integrity and fast queries.
- You already have events (event sourcing pairs naturally with CQRS).
- Different consumers need very different views of the same underlying data.

## Trade-offs
**Pros**
- Read side can be denormalized, indexed, cached, replicated independently.
- Write side stays small, focused on invariants and validation.
- New read models added without touching write code.
- Each side scales independently.

**Cons**
- Two models to maintain — more code, more concepts.
- Read side is **eventually consistent** with the write side; UX must accommodate.
- Debugging "I just wrote it, why can't I read it?" is now a real conversation.
- Often introduced too early; for small apps it is pure overhead.

**Rule of thumb:** introduce CQRS when one model can no longer serve both your write invariants and your read patterns without ugly compromise. Not before.

## Real-world analogies
- A library: the catalog (read view) is updated from acquisitions (write events), but the catalog and the inventory ledger are different artifacts.
- A bank: transactions (write) versus the monthly statement and dashboard (read).
- A newspaper: the newsroom (writes stories) versus the printed edition (read view of the day).

## Run the demo
```bash
node demo.js
```

The demo runs a `Products` write side that accepts commands and appends events, and a read side that subscribes to those events and maintains a denormalized "catalog" view. We issue commands, then query the read view.

## Deeper intuition

Communication patterns are agreements about timing, coupling, ownership, and failure visibility. Every message path answers hidden questions: who waits, who retries, who owns the source of truth, and how much inconsistency the business can tolerate.

A strong grasp of **CQRS — Command Query Responsibility Segregation** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **CQRS — Command Query Responsibility Segregation** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with BFF Backend for Frontend or Event Sourcing instead:** those may still matter, but **CQRS — Command Query Responsibility Segregation** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply CQRS — Command Query Responsibility Segregation everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **CQRS — Command Query Responsibility Segregation** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat CQRS — Command Query Responsibility Segregation as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
