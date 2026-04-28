# Microservices

**Category:** System Architecture

## Intent
Multiple independently deployable services, each owning its own data and exposing a network API. Each service is small enough that a single team can own it end-to-end. Services communicate over the network — typically HTTP, gRPC, or messaging.

## When to use
- The monolith has hit a *real* limit: a hot module is starving others; teams can't ship without coordinating; deploy frequency varies wildly across features.
- Different parts of the system have very different scaling needs (one slice needs 100 instances, another needs one).
- You have the platform engineering capacity to run them (CI/CD, observability, service discovery, secrets, etc.).

## Trade-offs
**Pros**
- Independent deploy cadence — teams ship without coordinating.
- Independent scaling — each service sized for its load.
- Failure isolation (when done right) — one service down doesn't crash the others.
- Polyglot — different services can use different languages/runtimes.

**Cons**
- Operationally **expensive**: service discovery, distributed tracing, deployment pipelines, schema versioning.
- Network is unreliable — every call needs retries, timeouts, circuit breakers.
- Cross-service transactions become sagas with compensations.
- Eventual consistency replaces "just one transaction."
- Debugging requires cross-service traces, not just stack traces.
- Most "microservices" projects fail by being premature monolith-splits.

**Rule of thumb:** You probably don't need this yet. The right number of services is the smallest number that lets your teams move quickly *and* keeps the platform team sane.

## Real-world analogies
- A modern airport: ticketing, security, baggage, gates, concessions — each a service with its own staff. Failures are isolated; coordination is heavy.
- A city of specialized shops vs a single department store: more independence, more friction.

## Run the demo
```bash
node demo.js
```

The demo simulates two services in one Node process, communicating ONLY over an HTTP-shaped channel (no shared variables, no direct function calls). Each service has its own data store. This makes the network cost visible.

## Deeper intuition

System architecture topics change the unit of thinking from classes to deployable pieces and interaction styles. The important question is no longer just 'is this code clean?' but 'what does this topology make easy, expensive, risky, or organizationally awkward?'

A strong grasp of **Microservices** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Microservices** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Pipes and Filters or Client Server vs Peer to Peer instead:** those may still matter, but **Microservices** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Microservices everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Microservices** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Microservices as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
