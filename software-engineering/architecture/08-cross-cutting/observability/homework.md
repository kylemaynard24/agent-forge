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
