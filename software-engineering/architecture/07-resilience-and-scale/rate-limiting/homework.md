# Homework — Rate Limiting

> Apply token bucket per-key. The **constraints** are the point.

## Exercise: Per-API-key limiter

**Scenario:** Your API serves three plans: free (10 rpm), pro (100 rpm), enterprise (1000 rpm). Each request carries an `X-API-Key`. Over-limit responses must include `Retry-After` so good clients can back off.

**Build:**
- A `RateLimiter` keyed by API key, parameterized by plan.
- A middleware-style `admit(key)` that returns `{ allowed, retryAfterMs, remaining }`.
- A simulator that fires mixed traffic from three keys and reports admission counts and reject reasons.

**Constraints (these enforce the concept):**
- Buckets must be per-key — one runaway free-plan key cannot affect another free-plan key.
- The limiter must compute `Retry-After` accurately based on refill rate (not a fixed value).
- Idle keys must not consume memory forever — implement a TTL eviction.
- `admit` must be O(1) per call, no scanning of all keys.

## Stretch
- Add a **second** layer: a global limiter on top (e.g., max 5000 rpm total across all keys) so a flood of new keys can't overwhelm the box.
- Implement a **sliding window** counter and compare its admission decisions to token bucket on the same trace. When do they differ?

## Reflection
- You run 10 instances behind a load balancer. The token bucket lives in process memory. What goes wrong, and how do you fix it?

## Done when
- [ ] Each plan's effective rate matches its configured limit (verifiable in the simulator output).
- [ ] Rejected responses tell the client when to retry.
- [ ] Memory does not grow unboundedly under churn.
