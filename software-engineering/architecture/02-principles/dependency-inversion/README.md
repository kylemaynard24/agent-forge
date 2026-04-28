# Dependency Inversion Principle (DIP)

**Category:** Principles (the **D** in SOLID)

## Intent
- High-level modules should not depend on low-level modules. Both should depend on **abstractions**.
- Abstractions should not depend on details. Details should depend on abstractions.

In practice: business logic doesn't import a Stripe SDK or a Postgres client. It defines an interface (`PaymentGateway`, `UserRepository`), and concrete adapters implement the interface from the outside in.

## DIP vs Dependency Direction (the fundamental)
The fundamental concept is "stable things shouldn't depend on volatile things." DIP is the practical recipe: introduce an abstraction owned by the high-level module, and have the low-level module implement it.

## When to use
- Business logic imports HTTP, DB, or vendor SDKs directly.
- You can't test the high-level rule without spinning up infrastructure.
- Replacing a vendor (Stripe → Adyen) requires editing the policy code.

## Trade-offs
**Pros**
- Business logic is testable in isolation.
- Vendor swaps are wiring changes, not code changes.
- The expensive-to-change layer (rules) doesn't depend on the cheap-to-change layer (drivers).

**Cons**
- Indirection — "click to definition" lands on an interface.
- Over-applied, every call goes through three indirections.

**Rule of thumb:** If your business logic imports the word "Stripe" (or "Postgres", or "Redis", or "Express"), DIP is missing.

## Real-world analogies
- Wall outlets: the wall doesn't know what's plugged in. The lamp depends on the standard, not the wall.
- Standard testing protocols (ISO, ASTM): the experimenter depends on the spec, the lab provides instruments that meet it.

## Run the demo
```bash
node demo.js
```

The demo defines `OrderProcessor` depending on a `PaymentGateway` abstraction; an in-memory mock and a "Stripe-like" adapter both implement it. The processor is identical across both runs.

## Deeper intuition

Design principles are heuristics for preserving flexibility under change. None of them are laws; all of them can be over-applied. The point of learning them is to get better at seeing why a codebase feels rigid or slippery, not to turn every review into acronym enforcement.

A strong grasp of **Dependency Inversion Principle (DIP)** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Dependency Inversion Principle (DIP)** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Law of Demeter or Liskov Substitution instead:** those may still matter, but **Dependency Inversion Principle (DIP)** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Dependency Inversion Principle (DIP) everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Dependency Inversion Principle (DIP)** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Dependency Inversion Principle (DIP) as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
