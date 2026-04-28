# BFF — Backend For Frontend

**Category:** Communication

## Intent
A dedicated backend per frontend (web, iOS, Android, smart TV). Each BFF owns the request shape, response shape, and aggregation logic for *its* client. Shared backend services stay generic; the BFF tailors them.

## When to use
- Multiple clients have genuinely different needs (mobile bandwidth, web feature breadth, embedded constraints).
- A single API has been forced to compromise between clients and is making everyone unhappy.
- Different clients ship on different cadences and need independent contract evolution.
- You want each frontend team to own their backend without forking the core services.

## Trade-offs
**Pros**
- Each client gets exactly the shape and payload it needs.
- Frontend teams own their BFF — no cross-team queueing.
- Core services stay generic and don't grow per-client branches.
- Independent deploy cadence per client.

**Cons**
- More services to deploy and operate.
- Duplication risk — the same aggregation logic may appear in multiple BFFs.
- Wrong line of ownership: a BFF run by the backend team becomes a regular gateway again.
- Cross-cutting concerns (auth, logging) must be solved consistently across BFFs.

**Rule of thumb:** the BFF belongs to the frontend team. If it doesn't, you've built an API gateway with extra steps.

## Real-world analogies
- A translator dedicated to one delegation at a UN conference — same speech, different tailored output per audience.
- A personal assistant per executive — same company, but each assistant knows their boss's preferences.
- A waiter who knows exactly what the regulars order and pre-trims their dishes.

## Run the demo
```bash
node demo.js
```

The demo runs two BFFs in front of the same `users` and `orders` services. The web BFF returns full data; the mobile BFF returns a trimmed payload optimized for limited bandwidth.

## Deeper intuition

Communication patterns are agreements about timing, coupling, ownership, and failure visibility. Every message path answers hidden questions: who waits, who retries, who owns the source of truth, and how much inconsistency the business can tolerate.

A strong grasp of **BFF — Backend For Frontend** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **BFF — Backend For Frontend** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with API Gateway or Async Messaging instead:** those may still matter, but **BFF — Backend For Frontend** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply BFF — Backend For Frontend everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **BFF — Backend For Frontend** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat BFF — Backend For Frontend as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
