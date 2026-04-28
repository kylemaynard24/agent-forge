# Retry and Timeout

**Category:** Resilience and Scale

## Intent

Treat transient failures as recoverable: bound every external call with a **timeout**, and on failure **retry** with exponential backoff plus jitter. Together they convert flaky dependencies into reliable ones without amplifying outages.

## When to use

- The downstream is occasionally flaky (network blips, brief contention, leader elections).
- The operation is idempotent, or you have an idempotency key.
- You can tolerate the extra latency a retry adds.
- A hung call would otherwise block a worker indefinitely.

## Trade-offs

**Pros**
- Hides transient noise from callers.
- Timeouts free workers from doomed calls — bounded latency under failure.
- Jitter prevents synchronized retry storms across many clients.

**Cons**
- Retries on a non-idempotent endpoint can double-charge, double-send, double-write.
- Naive retry amplifies load on a struggling downstream — pair with a circuit breaker.
- More retries means worse tail latency. The user is still waiting.
- Timeouts that are too tight cause spurious retries; too loose and they don't help.

**Rule of thumb:** every network call gets a timeout, every retry gets a budget, and every retry needs jitter.

## Real-world analogies

- Refreshing a webpage that didn't load — but waiting a moment before each refresh.
- A pilot trying the radio twice before declaring an emergency, but not fifty times.
- An elevator door that retries closing if blocked, then waits longer before the next attempt.

## Run the demo

```bash
node demo.js
```

The demo wraps a function that succeeds only 30% of the time in a retry-with-jitter + timeout helper, and shows that calls converge to success within the retry budget while bounded calls never hang forever.

## Deeper intuition

Resilience and scale topics teach you to design for bad days instead of ideal days. The mature question is not whether something can fail, but how failure is detected, bounded, retried, absorbed, or surfaced before it becomes systemic damage.

A strong grasp of **Retry and Timeout** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
