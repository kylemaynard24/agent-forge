# Homework — Asynchronous Messaging

> Apply producer/consumer decoupling. The **constraints** are the point.

## Exercise: Welcome-email pipeline

**Scenario:** When a user signs up, the API needs to send a welcome email. Email delivery is slow (200-800ms) and flaky (10% failure rate). Sign-up should never wait on it.

**Build:**
- A `signUp(user)` function that enqueues an `EmailJob` and returns immediately.
- An `EmailWorker` that pulls jobs and "sends" them with a simulated delay and failure rate.
- A retry policy: failed jobs go back on the queue with a max of 3 attempts.
- A dead-letter list for jobs that exhaust retries.

**Constraints (these enforce the concept):**
- `signUp` must return in < 5ms regardless of worker state.
- The worker must process **one job at a time** (concurrency = 1) so backpressure is visible.
- No try/catch in `signUp` for email errors — if email is broken, sign-up still succeeds.
- Queue size must be observable; print it whenever it changes.

## Stretch
- Add a second worker. How does throughput change? What new ordering problems appear?
- Persist the queue to a JSON file so jobs survive a restart. What goes wrong if the worker crashes mid-job?

## Reflection
- What does the user actually experience if email delivery is permanently broken? Is that acceptable? How would you signal it?

## Done when
- [ ] 20 sign-ups complete in under 100ms total.
- [ ] At least one retry visible in the log.
- [ ] At least one dead-lettered job after enough failures.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — message schemas as durable contracts

A message schema is a contract read by consumers who may have no access to the producer's codebase; a field named `ts` or `uid` forces every future reader to guess, while `enqueuedAt` and `recipientUserId` are self-documenting across a months-long gap. Because async messages outlive the sprint that created them, naming discipline here has a higher return than almost anywhere else in the codebase.

**Exercise:** Review your `EmailJob` schema and rename every field to be unambiguous without the surrounding code — include the unit in time fields (`createdAtMs`), spell out abbreviations, and prefix boolean fields with `is` or `has`. Then open the dead-letter entry and verify a stranger could diagnose the failure from the payload alone.

**Reflection:** If you received a dead-lettered `EmailJob` six months from now with no runbook, which fields would you wish you had named more clearly?
