# Bulkhead

**Category:** Resilience and Scale

## Intent

Partition shared resources (threads, connections, memory, slots) into isolated pools so a failure or flood in one pool **cannot starve** the others. Borrowed from ship design: a hull leak floods one compartment, not the whole ship.

## When to use

- Multiple tenants or call-types share a single resource pool.
- One slow or misbehaving consumer can saturate it and degrade everyone else.
- You can afford the (modest) capacity overhead of dedicated pools.
- You want graceful degradation — "tenant A is slow, tenant B is unaffected."

## Trade-offs

**Pros**
- Faults contained — a runaway tenant can't take down the system.
- Each pool can be tuned and observed independently.
- Failure modes become predictable and locally diagnosable.

**Cons**
- Lower overall utilization — pools can sit idle while another is starving.
- More config knobs (per-pool sizes, queues, timeouts).
- Sizing is a real estimation problem — too small and you reject healthy work, too large and isolation evaporates.

**Rule of thumb:** if one client's bad day shouldn't be every client's bad day, put a wall between them.

## Real-world analogies

- A ship's watertight bulkheads.
- An airport with separate security lanes for crew and passengers.
- A kitchen with separate stations for grill, fryer, and salad — a backed-up grill doesn't stop salads.

## Run the demo

```bash
node demo.js
```

The demo gives two tenants their own concurrency-limited pool of size 2. It floods tenant A with 10 slow jobs and runs 3 fast jobs for tenant B, showing that B's latency stays low while A queues up.

## Deeper intuition

Resilience and scale topics teach you to design for bad days instead of ideal days. The mature question is not whether something can fail, but how failure is detected, bounded, retried, absorbed, or surfaced before it becomes systemic damage.

A strong grasp of **Bulkhead** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
