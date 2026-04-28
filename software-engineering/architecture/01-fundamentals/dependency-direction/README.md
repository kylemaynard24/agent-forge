# Dependency Direction

**Category:** Fundamentals

## Intent
Dependencies should point toward **stable abstractions**, not toward volatile concrete details. High-level policy ("a user signed in") shouldn't depend on low-level mechanism ("a row was inserted into the `users` table in PostgreSQL"). Both depend on an abstraction in the middle.

## When to use
- When low-level details (DB driver, HTTP client, file system) are imported deep inside business logic.
- When swapping an implementation requires editing dozens of files.
- When tests can't run without a database, message queue, and three external services.

## Source-code dependency vs runtime call direction
These are not the same. At runtime, the policy *calls* the database. But in source code, the policy *depends on* an interface — and the database depends on (implements) that interface. The arrow in source flips while the call goes the same way.

```
Source-code dependency:    Runtime call:
Policy ──▶ Interface       Policy ──▶ Storage impl
           ▲                          
           │                          
       Storage impl                   
```

## Trade-offs
**Pros**
- Test policies without standing up infrastructure.
- Swap the database without touching policies.
- The expensive-to-change parts (business rules) don't depend on the cheap-to-change parts (frameworks, drivers).

**Cons**
- One more layer (the interface).
- Indirection makes "click through to definition" land on an abstract method.

**Rule of thumb:** Stable things shouldn't depend on volatile things.

## Real-world analogies
- A wall outlet is a stable interface; the device plugged in is volatile (you can swap a phone for a lamp). The wall doesn't depend on the lamp.
- A standard testing protocol — the experiment depends on the spec, not on a particular lab's instruments.

## Run the demo
```bash
node demo.js
```

The demo defines a `UserPolicy` that depends on a `UserStorage` interface, then swaps two implementations (in-memory and "Postgres-like") without touching the policy.

## Deeper intuition

Fundamental design topics are the physics of software. They look simple because they are old and broadly stated, but they keep reappearing because every architecture eventually pays for violating them. Treat them less like slogans and more like recurring force diagrams: where is knowledge concentrated, where does change ripple, and where are you accidentally making two concerns rise and fall together?

A strong grasp of **Dependency Direction** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Dependency Direction** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Coupling and Cohesion or Dry Kiss Yagni instead:** those may still matter, but **Dependency Direction** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Dependency Direction everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Dependency Direction** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Dependency Direction as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
