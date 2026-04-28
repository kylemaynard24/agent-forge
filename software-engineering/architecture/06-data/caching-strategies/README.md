# Caching Strategies

**Category:** Data

## Intent
Trade memory for latency by storing recent or frequent data in a faster tier in front of the source of truth. Pick a strategy — **cache-aside**, **write-through**, **write-behind** — based on how much staleness you can tolerate and how strict your durability requirements are.

## When to use
- Read-heavy workloads where the same data is fetched repeatedly.
- The cost of computing or fetching the data is high; the data changes slowly.
- You can tolerate some staleness, or you have a clean invalidation signal.
- You need to absorb traffic spikes without scaling the source-of-truth store.

## Trade-offs
**Pros**
- Massive read latency reduction.
- Reduces load on the primary store.
- Cheap horizontal scaling for reads.

**Cons**
- Cache invalidation is famously one of the two hardest problems in CS.
- Stale reads — the cache may show old data after a write.
- Write-behind risks data loss on cache failure.
- Adds an extra component to operate, monitor, and reason about.

**Strategies**
- **Cache-aside (lazy / read-through):** App reads from cache; on miss, reads DB and populates the cache. Writes go to DB and *invalidate* the cache.
- **Write-through:** Every write goes through the cache to the DB synchronously. Reads always hit cache.
- **Write-behind (write-back):** Writes go to cache and are asynchronously flushed to the DB. Lowest write latency, highest data-loss risk.

**Rule of thumb:** start with cache-aside. It's simple, the failure modes are obvious, and it survives a cache outage gracefully.

## Real-world analogies
- A chef's mise en place — frequently used ingredients pre-staged at hand, restocked from the walk-in as needed.
- A bookmark — the page you keep returning to is an O(1) lookup instead of re-searching the library.
- A coffee thermos — refilled occasionally from the pot; you sip from the thermos.

## Run the demo
```bash
node demo.js
```

The demo runs cache-aside reads against a slow "DB" — first call is a miss, second is a hit, then a write invalidates and the next read repopulates.

## Deeper intuition

Data architecture is where software design meets physical constraints. Reads, writes, consistency, replication, and ownership all have sharp costs. These topics matter because a lot of 'architecture' becomes real only when it hits data movement and storage boundaries.

A strong grasp of **Caching Strategies** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Caching Strategies** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with CDC and Outbox or Database Per Service instead:** those may still matter, but **Caching Strategies** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Caching Strategies everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Caching Strategies** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Caching Strategies as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
