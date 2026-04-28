# Homework — Synchronous REST / RPC

> Apply synchronous request/response. The **constraints** are the point.

## Exercise: Build a price-lookup service

**Scenario:** A checkout flow needs to look up the current price of a product before showing the order total. The frontend cannot proceed without this number.

**Build:**
- An HTTP server with `GET /price/:sku` returning `{ sku, price, currency }`.
- A client that calls it for three SKUs and prints the total.
- A `--latency=N` flag on the server that adds `N` ms of artificial delay.

**Constraints (these enforce the concept):**
- Client must `await` each call before issuing the next (no parallelism). Feel the chain.
- Every call must time out after 250ms; on timeout, fail loudly — do not return a default.
- Server must return proper status codes: 200, 404, 500. No "200 with `error` field".
- No queues, no callbacks, no fire-and-forget. Sync only.

## Stretch
- Add a single retry with exponential backoff on 5xx (but not on 4xx). Explain why.
- Run the calls in parallel with `Promise.all` and measure the latency drop. When is parallel safe?

## Reflection
- At what point does adding more synchronous calls in series become unacceptable, and what would you reach for instead?

## Done when
- [ ] Three SKU prices fetched and totaled.
- [ ] Timeouts trigger when `--latency=500`.
- [ ] 404 and 500 paths exercised in your test run.
