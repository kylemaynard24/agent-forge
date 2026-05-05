# Homework — Idempotency

> Apply idempotency keys end-to-end. The **constraints** are the point.

## Exercise: Idempotent order-placement endpoint

**Scenario:** You run an `POST /orders` endpoint. Mobile clients sometimes retry on weak connections. You must guarantee that one logical "place order" intent results in exactly one order, even with five retries.

**Build:**
- A `placeOrder({ idempotencyKey, items, userId })` that uses an `IdempotencyStore`.
- The store must persist `{ key -> { state, response, requestHash } }`.
- A test harness that fires 5 concurrent retries with the same key and asserts exactly one order created.
- A test for the "key reused with a different body" case.

**Constraints (these enforce the concept):**
- Keys are **required** on every mutation. No key, no service.
- Concurrency: two simultaneous requests with the same key must result in **one** execution. The other waits or is told "in progress."
- Storing a request hash next to the key is mandatory. Same key + different body must be rejected (it's a client bug).
- TTL: keys expire after 24 hours (use a fake clock in tests).
- Returning a cached response must include the **original** status code and body, byte for byte.

## Stretch
- Make the dedup work across two service instances by backing the store with a (simulated) Redis using `SET NX` semantics.
- Add a "soft replay" flag: the cached response is returned but a header tells the client "this is a replay, original was at T0."

## Reflection
- What's the difference between "exactly once" delivery and "exactly once" *effect*? Which of these is achievable, and how does idempotency enable the achievable one?

## Done when
- [ ] Five concurrent retries produce one order, one bill, one shipping label.
- [ ] Same key + different body is rejected with a clear error.
- [ ] Replays return the original response unchanged.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — idempotency key names must make the scope of "same operation" unambiguous

A key field named `key` or `id` in the `IdempotencyStore` reveals nothing about what uniqueness it enforces; `clientIdempotencyKey` distinguishes the client-supplied deduplication token from the server-assigned order ID, making it impossible to confuse the two in a code review or a database dump. The "same key + different body = client bug" rule is only enforceable if the key's name communicates that it is a client-controlled deduplication token, not a server identity.

**Exercise:** Audit every variable and store field name related to idempotency in your implementation. Rename them so that `clientIdempotencyKey`, `requestBodyHash`, `cachedResponseBody`, and `cachedResponseStatus` are clearly distinguishable from each other and from the order's own `orderId`. Then verify the error message for "same key, different body" names both fields explicitly.

**Reflection:** If a mobile client accidentally used the user's session token as the idempotency key for all their order requests, what would the observable symptom be — and what in the key's name could have made that misuse more obvious to the client SDK author?
