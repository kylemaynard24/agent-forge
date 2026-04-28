# Idempotency

**Category:** Resilience and Scale

## Intent

Make an operation safe to retry. The same logical request — identified by an **idempotency key** — must produce the same observable effect, no matter how many times it is delivered. This is what makes retry, queues, and at-least-once delivery survivable.

## When to use

- Any non-trivial mutation that can be retried by the network, the client, or a queue.
- Payments, order placement, sending emails, provisioning resources.
- Public APIs where clients implement their own (often eager) retries.
- Any system using at-least-once delivery semantics.

## Trade-offs

**Pros**
- Retries become safe by construction — no double-charges, no double-sends.
- Allows aggressive retry policies upstream without fear.
- Makes recovery from partial failures trivial: just retry.

**Cons**
- You must store key state somewhere (DB, cache) — that store has its own failure modes.
- Key lifetime is a real decision: too short and you lose dedup; too long and you grow forever.
- Returning the cached response means returning the *original* response — including its errors. Subtle.
- Retrofitting onto an existing endpoint is harder than designing it in.

**Rule of thumb:** if a request mutates state, require an idempotency key. The server, not the client, decides whether to apply or replay.

## Real-world analogies

- Pressing the elevator button five times — the elevator still only comes once.
- A check with a unique number — the bank refuses to cash it twice.
- A wedding RSVP card with a code — the second copy is filed, not counted.

## Run the demo

```bash
node demo.js
```

The demo wraps a `chargeCard` operation with idempotency-key dedup. Calling twice with the same key returns the cached result and does not re-charge; calling with a new key creates a new charge.

## Deeper intuition

Resilience and scale topics teach you to design for bad days instead of ideal days. The mature question is not whether something can fail, but how failure is detected, bounded, retried, absorbed, or surfaced before it becomes systemic damage.

A strong grasp of **Idempotency** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Idempotency** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Circuit Breaker or Load Balancing instead:** those may still matter, but **Idempotency** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Idempotency everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Idempotency** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Idempotency as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
