# Homework — Observability

> Apply the three pillars: logs, metrics, traces. The **constraints** are the point.

## Exercise: Instrument a checkout flow

**Scenario:** You have a `POST /checkout` that calls cart, pricing, inventory, and payments. Today the logs are unstructured strings, there are no metrics, and there is no trace. A customer reports "checkout was slow" — and you have no way to investigate.

**Build:**
- A small tracer that supports nested spans across the four downstream calls.
- Two counters: `checkout_requests_total{outcome="ok|error"}` and a histogram of `checkout_latency_ms`.
- A structured logger that emits one JSON line per request with `traceId`, `userId`, `outcome`, `durationMs`.
- A driver that runs 50 requests with mixed outcomes and prints the metrics summary at the end.

**Constraints (these enforce the concept):**
- Every span must include the parent span's id (so a tree can be reconstructed).
- The trace id must propagate to all downstream calls (in real systems, via headers).
- No high-cardinality metric labels — `userId` belongs in logs/traces, **not** metrics.
- Log lines must be valid JSON, one per line, sortable by `ts`.
- Latency histogram has explicit buckets (e.g., `[10, 50, 100, 500, 1000]` ms).

## Stretch
- Add **sampling**: keep all error traces, sample 10% of OK traces. Show that the metrics are still accurate while the trace volume drops.
- Add a **correlation id** that comes from the request header if present, else generated.

## Reflection
- A user says "checkout was slow at 2:14pm." With only logs, what can you find? With only metrics? With only traces? What makes all three together more than the sum of their parts?

## Done when
- [ ] You can reconstruct the full call tree of any single request from its trace.
- [ ] You can compute P95 latency from your metrics without scanning logs.
- [ ] No metric label can blow up cardinality.

---

## Clean Code Lens

**Principle in focus:** Comments and naming — log quality is clean code for the operations layer

A log line reading `"error occurred"` at the `INFO` level with a concatenated string like `"user " + userId + " failed"` is the observability equivalent of a function named `doStuff` — it records that something happened without revealing what, to whom, or at what severity. Structured log fields (`{ "event": "checkout_payment_failed", "userId": "u_123", "amountCents": 4500, "reason": "card_declined" }`) apply the same meaningful-names discipline to operations that clean code applies to variables.

**Exercise:** Review every log statement in your checkout flow and apply three rules: (1) the `message` field must be a past-tense sentence describing a specific business event, not a generic status; (2) every log level must be justified — demote anything at `INFO` that an on-call engineer would not act on; (3) no string concatenation — every dynamic value must be a named structured field. Count how many log lines needed changes.

**Reflection:** If you searched your logs for all `checkout_payment_failed` events in the last hour to investigate a spike, what structured fields would you need to be present to answer "which payment provider caused it, and for which user cohort?"