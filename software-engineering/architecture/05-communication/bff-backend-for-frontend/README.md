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
