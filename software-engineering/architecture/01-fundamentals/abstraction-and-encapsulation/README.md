# Abstraction and Encapsulation

**Category:** Fundamentals

## Intent
- **Abstraction** — exposing *what* something does while hiding *how*. The interface tells you "deposit money"; not "increment a 64-bit integer in this struct."
- **Encapsulation** — bundling state with the operations that maintain its invariants, and *hiding* that state so callers can't break the invariants.

The two travel together. Abstraction is the cover; encapsulation is the lock.

## When to use
- Whenever you have a value with rules (Money, Email, BankAccount, Date range) — wrap it.
- When clients are reaching into your internals to do work that should be your responsibility.
- When fixing a bug requires changing 12 callers, not 1 — your data is too exposed.

## Trade-offs
**Pros**
- Invariants are enforced in one place.
- Internals can change without breaking callers.
- Bugs caused by "what if balance is negative?" become impossible to express.

**Cons**
- More boilerplate up front (constructors, accessors).
- Bad abstractions are worse than no abstractions — they leak in surprising ways and are expensive to remove.

**Rule of thumb:** If callers are doing arithmetic on your fields to compute something derived, that derivation belongs on you.

## Real-world analogies
- A car's gas pedal is an *abstraction*: you don't manage fuel injection. The fuel tank is *encapsulated*: you can't pour gasoline directly into the engine cylinders.
- A vending machine: you press a button (interface). You can't reach inside.

## Run the demo
```bash
node demo.js
```

The demo contrasts an exposed-balance account that callers can corrupt with an encapsulated account that enforces "no overdraft" as an invariant.

## Deeper intuition

Fundamental design topics are the physics of software. They look simple because they are old and broadly stated, but they keep reappearing because every architecture eventually pays for violating them. Treat them less like slogans and more like recurring force diagrams: where is knowledge concentrated, where does change ripple, and where are you accidentally making two concerns rise and fall together?

A strong grasp of **Abstraction and Encapsulation** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Abstraction and Encapsulation** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Dependency Direction or Dry Kiss Yagni instead:** those may still matter, but **Abstraction and Encapsulation** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Abstraction and Encapsulation everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Abstraction and Encapsulation** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Abstraction and Encapsulation as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
