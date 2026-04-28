# Saga

**Category:** Communication

## Intent
Coordinate a long-running business transaction across multiple services without distributed locks or two-phase commit. Each step is committed locally; if a later step fails, **compensating actions** undo the earlier steps' business effects.

## When to use
- A workflow spans multiple services or aggregates that cannot share a transaction.
- Steps are individually fast and committable, but the overall outcome must be all-or-nothing in business terms.
- Booking, ordering, provisioning — any "reserve, reserve, reserve, charge" pattern.
- 2PC is not available, not desirable, or not affordable at your scale.

## Trade-offs
**Pros**
- No distributed locks; each service stays autonomous.
- Naturally async-friendly; works over message buses.
- Failure handling is explicit and visible (the compensation list is a feature).
- Scales: no global coordinator holding locks.

**Cons**
- Compensations are not always perfect inverses (refund != "undo charge"; there is a record).
- Visibility windows: between step 1 and rollback, partial state is observable. Design for it.
- Idempotency is mandatory at every step and every compensation.
- Orchestrator vs choreography is a real architectural choice with long-term consequences.

**Rule of thumb:** if you cannot wrap it in one DB transaction and the steps cross services, you need a saga. Pretending otherwise is how you create money leaks.

## Real-world analogies
- Booking a vacation: book the flight, then the hotel, then the car. If the car booking fails, you cancel the hotel and the flight.
- A surgical checklist with backout procedures at each step.
- A multi-stage rocket launch with abort modes per stage.

## Run the demo
```bash
node demo.js
```

The demo runs a "book trip" saga: reserve flight, reserve hotel, reserve car. The car step is forced to fail, triggering the saga to compensate the hotel reservation, then the flight reservation, leaving the system in a consistent state.

## Deeper intuition

Communication patterns are agreements about timing, coupling, ownership, and failure visibility. Every message path answers hidden questions: who waits, who retries, who owns the source of truth, and how much inconsistency the business can tolerate.

A strong grasp of **Saga** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Saga** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with BFF Backend for Frontend or CQRS instead:** those may still matter, but **Saga** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Saga everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Saga** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Saga as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
