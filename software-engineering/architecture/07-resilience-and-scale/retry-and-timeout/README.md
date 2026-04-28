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

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Retry and Timeout** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Load Balancing or Rate Limiting instead:** those may still matter, but **Retry and Timeout** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Retry and Timeout everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Retry and Timeout** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Retry and Timeout as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
