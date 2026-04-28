# Homework — Microservices

> Pay the network tax only when you have to.

## Exercise: Extract one service from a modular monolith

**Scenario:** Your modular monolith has `users`, `orders`, `notifications`. Notifications has gotten heavy: it's CPU-bound on email rendering and you want to scale it independently. The rest of the app is fine where it is.

**Build:**
- Pick `notifications` to extract. Define a JSON HTTP API: `POST /notifications`, `GET /notifications/:userId/unread`.
- Replace the in-process call (`Notifications.create(...)`) with an HTTP client wrapper.
- Move notifications data to its own store (separate Map / DB).
- The new service runs in its own process (in this exercise, a separate `node` invocation; talk over `localhost:PORT`).
- Add: a timeout on the HTTP call, one retry, and a fallback ("if notifications is down, log and continue — don't fail the parent request").

**Constraints (these enforce the concept):**
- Notifications data is reachable ONLY through the HTTP API.
- The caller has no shared types with notifications — only the JSON contract.
- A notifications outage must not break order placement (degrade gracefully).
- You measure and document the latency overhead of the extraction.

## Stretch
You'll discover the **N+1 query problem**: enriching a list of N orders with notification counts requires N network calls. Pick one of two fixes:
1. Add a batch endpoint: `POST /notifications/batch-counts` accepting `{userIds: [...]}`.
2. Have notifications publish events; orders consumes and maintains a denormalized count.

Implement one. Measure the difference.

## Reflection
- "We need microservices for scaling" is often confused with "we need horizontal scaling." Pick a specific scaling problem and show whether microservices is the right answer.
- What's the *operational* cost you just took on? (Hint: monitoring, deploys, secrets, schema versioning, on-call rotation.)

## Done when
- [ ] Notifications runs in its own process with its own store.
- [ ] An outage of notifications doesn't break orders.
- [ ] You've measured the extra latency of one HTTP call vs the in-process baseline.
- [ ] You can articulate at least one thing that got *worse* — and why it might still be worth it.
