# Monolith

**Category:** System Architecture

## Intent
One deployable, one process, one database. All features run in the same address space. The simplest possible architecture — and the right starting point for almost every product.

## When to use
- Early-stage product. You don't yet know which seams will matter.
- Small team. Coordination cost of multiple services exceeds the gains.
- Tight feature integration. Cross-feature transactions are common.
- You haven't hit scale where the monolith hurts.

## Trade-offs
**Pros**
- Simplest possible operational story (one thing to deploy, monitor, debug).
- Cross-feature transactions are easy (just one DB).
- Calls between modules are function calls — no network, no serialization, no retries.
- Refactoring across modules is one PR.

**Cons**
- A bug in one module crashes the whole app.
- A "hot" module (heavy CPU, slow query) pessimizes the rest.
- Every deploy ships every change — large blast radius.
- Above ~30 engineers, merge friction starts to hurt.

**Rule of thumb:** Start here. **Always.** Most "we should be microservices" arguments are premature. The cost of distribution is real and immediate; the cost of monolith is gradual and visible — easier to manage.

## Real-world analogies
- A single building with all departments inside. Walking between offices is free; one fire alarm clears the whole place.

## Run the demo
```bash
node demo.js
```

The demo shows three "modules" (users, posts, comments) all in one process, all hitting one in-memory data store, with direct function calls between them.

## Deeper intuition

System architecture topics change the unit of thinking from classes to deployable pieces and interaction styles. The important question is no longer just 'is this code clean?' but 'what does this topology make easy, expensive, risky, or organizationally awkward?'

A strong grasp of **Monolith** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Monolith** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Modular Monolith or Pipes and Filters instead:** those may still matter, but **Monolith** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Monolith everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Monolith** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Monolith as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
