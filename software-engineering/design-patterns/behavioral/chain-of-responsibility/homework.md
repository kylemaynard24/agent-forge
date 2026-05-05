# Homework — Chain of Responsibility

> Pass a request along a chain of handlers; each can handle, modify, or pass.

## Exercise: HTTP middleware pipeline

**Scenario:** Build a tiny middleware pipeline that processes incoming requests through: `rateLimit → auth → logging → route`. Each handler can short-circuit, mutate the request, pass to the next, or throw.

**Build:**
- A `Handler` interface with `handle(req, next)`.
- Concrete handlers for rate-limit (rejects after N rps), auth (rejects without a token), logging (records and passes), route (final handler).
- A `Pipeline` class that wires them in order and runs `handle` recursively.

**Constraints (these enforce the pattern):**
- The request object never sees the chain — it just flows.
- Each handler decides independently to call `next` or not.
- Reordering the chain (e.g., putting logging first) is a single-line change.
- No handler knows how many handlers exist or where it sits in the chain.

## Stretch

Make all handlers async (return promises). A thrown error in `auth` should skip `logging` but still trigger a final error handler. Don't use a try/catch in every handler.

## Reflection

- Chain of Responsibility vs middleware-as-list (Express style). What's the *implementation* difference and which feels right when?

## Done when

- [ ] Adding a `cors` handler at any position works without editing other handlers.
- [ ] An auth failure short-circuits cleanly with the correct response.

---

## Clean Code Lens

**Principle in focus:** Single Responsibility Principle + Meaningful Names

Each handler in a chain should do exactly one thing, and its name should announce that thing without a comment — `RateLimitHandler` tells you everything, `Handler3` tells you nothing. Applied cleanly, the chain reads like a policy document: rate-limit, authenticate, log, route. Applied messily, a single "ValidationHandler" quietly does auth, logging, and business-rule checks, making the chain impossible to reorder or test in isolation.

**Exercise:** Take your `auth` handler and audit it: list every decision it makes. If you find more than one reason it could change (e.g., "the auth scheme changes" AND "the error format changes"), split it. Name each piece after its single job.

**Reflection:** If you renamed every handler in your chain to `Handler1`, `Handler2`, etc., could a new teammate still understand the pipeline's policy from reading the wiring code alone — and if not, what does that tell you about the names you chose?
