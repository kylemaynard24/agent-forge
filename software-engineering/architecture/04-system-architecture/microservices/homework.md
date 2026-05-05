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

---

## Clean Code Lens

**Principle in focus:** Service Names Should Map to Domain Capabilities, Not Technical Roles

A microservice's name is a bounded context declaration: `NotificationService` announces a domain capability and implies a specific team, schema, and deployment boundary. A service named `MessageProcessor` or `EventHandler` names a technical role — and a technical role name signals that the service boundary was drawn around an implementation pattern rather than a domain concept, making it harder to reason about ownership, failure, and evolution.

**Exercise:** Look at the service name `NotificationService` and the API you defined (`POST /notifications`, `GET /notifications/:userId/unread`). Now write a two-sentence "service charter" — what domain capability this service owns, and what it explicitly does NOT own. Check whether your HTTP route paths and JSON field names match that charter: any route or field name that sounds like infrastructure (`/events`, `/messages`, `type: "email"`) rather than domain capability (`/notifications`, `status: "unread"`) is a naming inconsistency between the service name and its surface.

**Reflection:** The N+1 Stretch exercise offers a batch endpoint (`POST /notifications/batch-counts`) as one fix. This endpoint is named from the *caller's* perspective (batch is a performance concern, not a domain concept). What would a domain-perspective name look like, and does changing the name change how you think about whether the endpoint belongs in `NotificationService` at all?
