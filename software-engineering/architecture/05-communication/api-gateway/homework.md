# Homework — API Gateway

> Apply a single front door. The **constraints** are the point.

## Exercise: E-commerce gateway

**Scenario:** You have three backend services — `catalog`, `inventory`, `pricing`. The web client should never call any of them directly.

**Build:**
- A gateway with routes: `GET /products/:id`, `GET /products/:id/availability`, `GET /products/:id/full` (aggregates all three).
- Bearer-token auth as middleware (one implementation, applied globally).
- A simple per-IP rate limiter (e.g. 5 req / second) as middleware.
- Request and response logging with a correlation ID.

**Constraints (these enforce the concept):**
- Auth, rate limiting, and logging must live in the gateway only — never in a backend service.
- The aggregating route must call backends **in parallel** when there are no dependencies between them.
- The gateway must not contain domain business rules (no "if product is on sale, also fetch X" — that belongs in a service).
- Each backend must be replaceable with a stub without changing client code.

## Stretch
- Add a circuit breaker around one backend. What happens to the aggregating route when that backend is down?
- Add response shaping: return a trimmed JSON for mobile clients (`?client=mobile`).

## Reflection
- A new feature requires data from a fourth backend. Where does the change happen, and what does that tell you about coupling?

## Done when
- [ ] All three routes work end-to-end.
- [ ] Unauth'd requests return 401 from middleware, not from any backend.
- [ ] Aggregated route demonstrably faster than sequential backend calls.
