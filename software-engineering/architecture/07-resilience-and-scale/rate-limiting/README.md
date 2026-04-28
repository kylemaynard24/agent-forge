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
