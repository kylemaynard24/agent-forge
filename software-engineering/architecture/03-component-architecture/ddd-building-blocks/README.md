# DDD Building Blocks

**Category:** Component Architecture

## Intent
Domain-Driven Design (DDD) gives you a vocabulary for modeling business rules. The four core tactical building blocks:

- **Entity** — has a stable identity over time. Two `User` instances with the same `id` are the same user, regardless of field changes.
- **Value Object** — defined entirely by its attributes. Two `Money(50, USD)` instances are interchangeable. Always immutable.
- **Aggregate** — a cluster of entities + value objects with one **aggregate root**. Outside code only references the root. The root enforces invariants across the cluster.
- **Repository** — a collection-like interface for an aggregate (`save`, `findById`). Hides persistence details; you "ask the collection" rather than write SQL.

## Key insight: aggregates draw consistency boundaries
The aggregate root is the only entry point. Inside, invariants must be enforced atomically (one transaction). Across aggregates, **eventual** consistency is fine. This is the single most important design call in DDD: where to draw the boundary.

## When to use
- A domain rich enough that "user posts comment" hides three rules and four edge cases.
- A team that wants the code to read like the business speaks (the *ubiquitous language*).
- Long-lived systems where domain models outlive frameworks.

## Trade-offs
**Pros**
- Code reflects business; conversations between devs and PMs become precise.
- Aggregates make consistency boundaries explicit.
- Value objects eliminate a class of bugs (currency mixing, date-vs-datetime, ids-as-strings).

**Cons**
- DDD has a vocabulary you'll get wrong twice before you get it right.
- Tactical patterns without strategic alignment (bounded contexts, ubiquitous language) is just CRUD with extra steps.
- Aggregates are oft-misdrawn — too big = lock contention; too small = invariants leak.

**Rule of thumb:** Make aggregates as small as possible. Anything that can be eventually consistent should NOT be in the same aggregate.

## Real-world analogies
- An `Order` aggregate (root) with `OrderLine` value objects: you submit, modify, or cancel the *whole order*; you don't reach in and edit one line through a backdoor.
- A bank `Account` aggregate enforcing "no overdraft" — it owns its `Transaction`s.

## Run the demo
```bash
node demo.js
```

The demo models an `Order` aggregate with `OrderLine` value objects. It enforces the invariant "total <= credit limit," shows that `OrderLine` instances are equal by value, and demonstrates that `Order` is the only public entry point.

## Deeper intuition

Component architecture is where local code structure turns into system shape. These topics teach you how to place business logic, dependencies, and interfaces so the important parts of the system can stay stable while implementation details remain replaceable.

A strong grasp of **DDD Building Blocks** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **DDD Building Blocks** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with MVC MVP MVVM or Clean Onion instead:** those may still matter, but **DDD Building Blocks** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply DDD Building Blocks everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **DDD Building Blocks** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat DDD Building Blocks as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
