# Circuit Breaker

**Category:** Resilience and Scale

## Intent

Stop calling a downstream that is clearly broken. After **N** consecutive failures, **open** the circuit and fail fast for a cool-off window. Then **half-open** to probe recovery, and **close** again on success. The breaker protects the downstream from being hammered while it heals, and protects the caller from wasting time and resources on doomed calls.

## When to use

- A downstream dependency can fail hard for seconds or minutes (deploys, restarts, GC pauses).
- Your callers can degrade gracefully (cache, default, error message) when the dependency is unreachable.
- Pure retry-with-backoff is making the outage worse rather than better.
- You want to surface dependency health as an explicit signal.

## Trade-offs

**Pros**
- Fails fast — callers don't pile up on a dead downstream.
- Gives the downstream room to recover instead of beating it while it's down.
- Surfaces a clean health signal you can alert on.

**Cons**
- An open breaker means *every* caller sees errors, even if a few succeed.
- Tuning the thresholds is genuinely hard — too sensitive flaps; too lax never trips.
- Hides the underlying issue if you don't alert on `open` transitions.
- Per-instance state — without coordination, fleet behavior can be uneven.

**Rule of thumb:** retry handles blips, the breaker handles outages. Use both, in that order.

## Real-world analogies

- An electrical breaker that trips on overload, then can be reset.
- A bouncer who, after enough trouble, locks the door for ten minutes before peeking out.
- A 911 dispatcher who stops dialing a phone that hasn't rung through five times in a row.

## Run the demo

```bash
node demo.js
```

The demo wraps a flaky service in a breaker that opens after 3 consecutive failures, fails fast while open, transitions to half-open after a cool-off, and closes again on a successful probe.
