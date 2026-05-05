# Homework — Retry and Timeout

> Apply retry-with-jitter and per-call timeouts. The **constraints** are the point.

## Exercise: Resilient HTTP client

**Scenario:** You are calling a downstream pricing API that fails about 20% of the time and occasionally hangs. The product needs sub-2-second responses, and the API endpoint is idempotent (a `GET /price/:sku`).

**Build:**
- A `getPrice(sku)` function that wraps a simulated flaky fetch.
- Configurable retry policy: max attempts, base backoff, per-attempt timeout, total budget.
- A small report at the end showing attempts, time spent, and outcome for 20 calls.

**Constraints (these enforce the concept):**
- Every attempt must have a timeout. No unbounded `await`.
- Backoff must use **full jitter** (random in `[0, cap]`, not fixed delay).
- A **total budget** must hard-cap total time across all retries — even if attempts remain.
- Retries only on transient errors (network/timeout/5xx). Do **not** retry on 4xx.
- Log each attempt: `attempt N, waited Wms, outcome`.

## Stretch
- Add a "retry budget" across the *whole client* (e.g., max 10% of calls in last 60s may retry). When the budget is exhausted, stop retrying and fail fast.
- Combine with a circuit breaker so repeated failures don't fan out into retry storms.

## Reflection
- If the downstream is overloaded and *every* client retries, what happens? Why does jitter alone not fix this?

## Done when
- [ ] No call ever hangs longer than `timeoutMs * maxAttempts + budget`.
- [ ] Retrying a non-idempotent operation is impossible by construction (think interface).
- [ ] You can demonstrate the difference in failure rate between "no retry" and "retry with jitter".

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — timeout constants name the operation and the reason for the value

A constant named `TIMEOUT = 250` is a magic number; `MAX_PRICING_API_WAIT_MS = 250` names the operation it governs, communicates the unit, and signals that the value is a deliberate upper bound — not an arbitrary guess. When the pricing team tells you their SLA is 200ms, a well-named constant makes it trivial to find every timeout in the codebase that references their API and update it consistently.

**Exercise:** Replace every numeric literal in your retry and timeout configuration with a named constant whose name encodes: (1) the operation it governs, (2) the unit (Ms, Seconds), and (3) whether it is a per-attempt limit or a total budget (`PER_ATTEMPT_PRICING_TIMEOUT_MS` vs `TOTAL_PRICING_CALL_BUDGET_MS`). Add a one-line comment to each constant explaining why that value was chosen.

**Reflection:** If the downstream pricing API upgraded its infrastructure and cut its P99 from 800ms to 200ms, which of your timeout constants would need to change — and how does a well-named constant make finding all the relevant values faster than a generic search for `250`?
