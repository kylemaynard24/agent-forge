# Homework — Bulkhead

> Apply resource isolation. The **constraints** are the point.

## Exercise: Per-tenant DB connection bulkheads

**Scenario:** Your service uses a single 20-connection pool to a shared Postgres. One enterprise tenant runs an analytical query that pegs 18 connections for 30 seconds. Every other tenant's API requests queue and time out.

**Build:**
- A simulated `ConnectionPool` with a fixed total capacity.
- A `TenantBulkhead` that allocates a sub-pool per tenant from the total.
- A driver that runs three tenants concurrently — one runs slow queries, two run fast queries — and reports per-tenant latency P50 and P99.

**Constraints (these enforce the concept):**
- A tenant **cannot** use more than its allocated slots, ever — even if the pool has free capacity in another tenant's slice.
- When a tenant is at its cap, new requests for that tenant **wait or reject** — they do not borrow.
- Pool size assignments are configuration, not code (a map of `tenantId -> slots`).
- Print the queue depth per tenant every 100ms during the run.

## Stretch
- Add a small "spillover" reserve (e.g., 10% of total) that any tenant can borrow if the rest of their slice is occupied — but only when global utilization is below a threshold.
- Compare: rejecting overflow vs. queueing overflow. Which gives better tail latency? Better throughput?

## Reflection
- A bulkhead reduces utilization. What signal would tell you the bulkhead is sized wrong?

## Done when
- [ ] Slow tenant cannot push other tenants past their normal latency.
- [ ] No globally shared waiting line — each tenant has its own.
- [ ] You can verify the isolation by chart or printed numbers.
