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
