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
