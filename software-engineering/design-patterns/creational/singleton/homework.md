# Homework — Singleton

> Apply the Singleton pattern. The **constraints** are the point — they're what force the pattern to be the natural answer instead of a workaround.

## Exercise: Shared rate limiter

**Scenario:** Two modules — `auth.js` and `billing.js` — each enforce a per-API-key rate limit (10 requests/sec). They must share counters: if `auth.js` records 6 calls for key `K`, `billing.js` must see 6.

**Build:**
- A `RateLimiter` Singleton with `allow(apiKey) → boolean` returning `false` once the per-second cap is hit.
- `auth.js` and `billing.js`, each grabbing the singleton and calling `allow()`.
- A demo that proves both modules share state.

**Constraints (these enforce the pattern):**
- Calling `new RateLimiter()` from outside the class must throw.
- The instance must be lazily created on first `getInstance()` call.
- No global variable — the instance must live as a private static field.

## Stretch

Write a unit test that demonstrates singleton state **leaks between tests** (the classic global-state hazard). Then design a `reset()` method that's available to test code but NOT to production. (Hint: separate test build, internal symbol gate, env-var check.)

## Reflection

- A plain ES module that exports an object is already a singleton (cached after first `require`). When would you reach for the *class-based* form anyway?
- What hidden cost did your test suite pay because the limiter is a singleton?

## Done when

- [ ] Two importing modules call `getInstance()` and observe shared counters.
- [ ] `new RateLimiter()` throws.
- [ ] You can articulate why "must be one" is often a lie (multi-tenant, sharded, test harness).
