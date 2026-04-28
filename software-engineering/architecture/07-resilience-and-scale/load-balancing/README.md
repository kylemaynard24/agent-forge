# Load Balancing

**Category:** Resilience and Scale

## Intent

Distribute incoming work across a set of replicas so no single node is overloaded while others are idle. The two foundational strategies are **round-robin** (next request to next backend, in order) and **least-connections** (next request to the backend currently handling the fewest in-flight calls).

## When to use

- You run more than one replica behind a single virtual address.
- Per-request cost is variable — some are cheap, some are expensive.
- You want horizontal scale instead of (or in addition to) vertical scale.
- You need failover — bad backends must be removed from rotation.

## Trade-offs

**Pros**
- Round-robin: stateless, easy, fair when requests are uniform.
- Least-connections: adapts to heterogeneous request cost.
- Combined with health checks, gives automatic failover.
- The load balancer is a natural place for TLS termination, retries, and metrics.

**Cons**
- Round-robin is blind to backend load — one slow request can trail behind a fast pile.
- Least-connections needs accurate per-backend counters; under multiple LB instances, those counters disagree.
- Sticky sessions improve cache hit rate but defeat balance.
- The LB itself is a single point of failure if not made redundant.

**Rule of thumb:** start with round-robin; switch to least-connections when request cost varies a lot; add health checks before either.

## Real-world analogies

- A queue at the bank that feeds whichever teller opens up next.
- A taxi rank — the next car takes the next fare, but if a car gets stuck on a long ride, dispatch sends the next fare to a different one.
- Multiple checkout lines at a grocery store — staffed dynamically based on length.

## Run the demo

```bash
node demo.js
```

The demo simulates 100 requests of varying cost across 3 backends, comparing round-robin vs. least-connections. It prints per-backend total work and the wall-clock to drain the queue under each strategy.
