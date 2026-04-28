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
