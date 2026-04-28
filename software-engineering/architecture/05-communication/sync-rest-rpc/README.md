# Synchronous REST / RPC

**Category:** Communication

## Intent
Caller sends a request and **waits** for the response on the same connection. The two services are temporally coupled: if the callee is down or slow, the caller is down or slow.

## When to use
- The caller genuinely needs the result before it can proceed (e.g. authorization, price lookup).
- Latency budget is tight and a round trip is acceptable.
- Operations are naturally request/response: `GET /users/42`, `POST /orders`.
- You want simple debugging — one request, one response, one stack trace.

## Trade-offs
**Pros**
- Dead simple mental model and tooling (curl, browser, Postman).
- Strong, immediate feedback: success and failure are explicit.
- Easy to reason about consistency — you got the answer or you didn't.

**Cons**
- Temporal coupling: callee outage cascades to caller.
- Tail latency adds up across chains of calls.
- Retries and timeouts must be handled at every hop.
- Synchronous fan-out amplifies failure (one slow dependency stalls everything).

**Rule of thumb:** use sync when the caller cannot make progress without the answer. Otherwise, prefer async messaging.

## Real-world analogies
- A phone call — both parties must be available simultaneously.
- A bank teller window — you wait at the counter until the transaction completes.
- Ordering at a restaurant counter and standing there for the food.

## Run the demo
```bash
node demo.js
```

The demo spins up an HTTP server on a random port, then a client makes two GET requests and a POST, prints the round-trip latency for each, and shuts the server down.

## Deeper intuition

Communication patterns are agreements about timing, coupling, ownership, and failure visibility. Every message path answers hidden questions: who waits, who retries, who owns the source of truth, and how much inconsistency the business can tolerate.

A strong grasp of **Synchronous REST / RPC** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Synchronous REST / RPC** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Pub Sub or Saga instead:** those may still matter, but **Synchronous REST / RPC** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Synchronous REST / RPC everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Synchronous REST / RPC** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Synchronous REST / RPC as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
