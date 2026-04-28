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
