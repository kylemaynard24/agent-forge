# Homework — Caching Strategies

> Apply cache-aside, write-through, write-behind. The **constraints** are the point.

## Exercise: Three strategies, one workload

**Scenario:** A `priceService` reads/writes to a slow DB (50-150ms). Implement three caches and measure each.

**Build:**
- A slow DB with read/write counters.
- `cacheAside` — read miss populates; write invalidates.
- `writeThrough` — read populates; write goes to cache and DB synchronously.
- `writeBehind` — read populates; write goes to cache; DB flush is async on a 200ms timer.
- A workload runner that issues 100 reads and 20 writes against each strategy and prints latency stats.

**Constraints (these enforce the concept):**
- Each strategy must be isolated — same interface, swappable implementations.
- A "kill the cache mid-run" simulation must demonstrate write-behind data loss.
- Cache and DB stats must be printed per strategy: hits, misses, db reads, db writes.
- No real network. Use `setTimeout` for both DB and cache latency to keep it deterministic.

## Stretch
- Add a TTL to cache-aside. Compare hit rate with TTL=1s vs 60s.
- Add a stampede protection (single-flight) so 100 concurrent misses for the same key only hit DB once.

## Reflection
- For each strategy, what failure of the cache layer can corrupt or lose data? Write one sentence per strategy.

## Done when
- [ ] Three strategies implemented with the same interface.
- [ ] Stats printed for each.
- [ ] Write-behind data-loss scenario reproduced and explained.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — cache keys encode identity and scope

A cache key like `"price"` or `"user_123"` forces every reader to open the caching logic to understand scope, TTL intent, and invalidation boundaries; a key like `"pricing:sku:ABC-99:v1"` encodes the namespace, the entity type, the identifier, and the schema version in a single readable string. Treating cache keys as opaque strings is the caching equivalent of naming a variable `x` — it works until someone needs to debug a stale-value incident at 2am.

**Exercise:** Define a key-builder function for each of your three strategies that encodes at minimum: the service namespace, the entity type, and the entity identifier. Then write a comment above each strategy's `invalidate` call documenting exactly which keys are invalidated and why, so the invalidation logic is self-explanatory.

**Reflection:** If a second developer added a new caching layer for the same `priceService` without looking at your implementation, what in your cache keys would prevent a key collision — and what would not?
