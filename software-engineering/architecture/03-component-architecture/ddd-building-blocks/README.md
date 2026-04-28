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
