# Homework — Circuit Breaker

> Apply the breaker pattern. The **constraints** are the point.

## Exercise: Breaker around a payment provider

**Scenario:** You charge cards through a third-party provider. When the provider degrades, your checkout API piles up requests waiting on it, and the rest of the site slows down. Wrap the provider call in a circuit breaker.

**Build:**
- A `chargeCard(amount, token)` that calls a simulated provider.
- A `CircuitBreaker` with the three states: `CLOSED`, `OPEN`, `HALF_OPEN`.
- A small driver that runs 50 calls through a healthy / failing / recovering provider and prints the state transitions and tail-latency under each phase.

**Constraints (these enforce the concept):**
- Once `OPEN`, calls **must not** invoke the downstream — they fail fast in O(1).
- Transition to `HALF_OPEN` is **time-based** (after `cooldownMs`). No external trigger.
- In `HALF_OPEN`, only **one** probe is allowed at a time. Concurrent calls fail fast.
- A success in `HALF_OPEN` closes the breaker; any failure re-opens it immediately.
- Every state transition must be logged with timestamp and reason.

## Stretch
- Use a **rolling window** of the last N results instead of consecutive failures (e.g., open if >50% of last 20 failed).
- Combine with retry-with-backoff: retries happen *inside* a single `call()`, the breaker opens on the *retry-exhausted* outcome, not on every blip.

## Reflection
- What does an `OPEN` breaker mean for your SLO? How do you decide when to open vs. when to keep retrying?

## Done when
- [ ] Under sustained downstream failure, downstream call rate drops to roughly zero (proven via a counter).
- [ ] Recovery is automatic — no human resets the breaker.
- [ ] State transitions are observable (logs or metrics).

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — use the canonical state machine vocabulary (CLOSED, OPEN, HALF_OPEN)

`CLOSED`, `OPEN`, and `HALF_OPEN` are an industry-wide shared vocabulary documented in every circuit breaker paper and library; renaming them `HEALTHY`, `FAILED`, `TESTING` in your implementation means every engineer joining the team must learn a private dialect before they can read the code or the logs. Using the canonical names is the clean code principle of "don't be clever" applied at the architecture vocabulary level.

**Exercise:** Search your implementation for any string or constant that represents a circuit breaker state. Ensure all three canonical names are used exactly as written (`CLOSED`, `OPEN`, `HALF_OPEN`) in state variables, log messages, and any exported metrics. Then verify that your state-transition log lines include both the previous and next state by name, not by a numeric code.

**Reflection:** If an engineer unfamiliar with circuit breakers saw a log line reading `state: 2 → 0`, how long would it take them to understand what happened — and how does using `OPEN → CLOSED` change that?
