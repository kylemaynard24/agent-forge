# Rate Limiting

**Category:** Resilience and Scale

## Intent

Cap the rate of requests admitted per key (per user, IP, tenant, route) to protect the system from bursts and abuse, and to enforce fairness across callers. The classic implementation is a **token bucket**: tokens refill at a steady rate and each request takes one.

## When to use

- A public API where any caller can send unbounded traffic.
- An expensive endpoint (LLM call, third-party API, big DB scan).
- Multi-tenant systems that need fair sharing.
- A downstream that has its own quota you must stay under.

## Trade-offs

**Pros**
- Predictable load — caps are caps.
- Cheap to implement (one counter + a clock per key).
- Token bucket allows short bursts up to the bucket size, smoothing spiky workloads.
- Simple, observable signal: "you were rate-limited at HH:MM:SS."

**Cons**
- Wrong limits frustrate legitimate users.
- Per-instance limiters under-count when you have many instances — you need a shared store (Redis) for accuracy.
- Choosing the right key (user? IP? device? tenant?) is part design, part politics.
- Doesn't help with cost — a single allowed request can still be expensive.

**Rule of thumb:** rate limit at the edge per identity, and rate limit again deeper for expensive operations.

## Real-world analogies

- A theme-park ride that takes one ticket per rider.
- A water meter — the city refills your "tokens" each month.
- A nightclub bouncer letting people in one at a time at a steady pace.

## Run the demo

```bash
node demo.js
```

The demo runs a token-bucket limiter at 5 requests per second. It fires 12 requests in a burst and then a steady stream, showing which are admitted and which are rejected as the bucket drains and refills.

## Deeper intuition

Resilience and scale topics teach you to design for bad days instead of ideal days. The mature question is not whether something can fail, but how failure is detected, bounded, retried, absorbed, or surfaced before it becomes systemic damage.

A strong grasp of **Rate Limiting** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
