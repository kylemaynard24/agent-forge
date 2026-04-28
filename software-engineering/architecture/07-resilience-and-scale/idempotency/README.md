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
