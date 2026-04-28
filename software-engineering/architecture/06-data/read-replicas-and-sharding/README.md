# Read Replicas and Sharding

**Category:** Data

## Intent
Scale a database in two complementary directions: **read replicas** (one writer, many followers) for read-heavy workloads, and **sharding** (partitioning data across nodes) for write-heavy workloads or datasets that exceed a single node.

## When to use
- **Read replicas:** read traffic dwarfs writes; you can tolerate small replication lag for reads.
- **Sharding:** the dataset or write rate exceeds a single primary; queries can be partitioned by a key (user_id, tenant_id).
- You've already exhausted vertical scaling and caching is no longer enough.
- You have a clear, stable shard key with even distribution.

## Trade-offs
**Pros — Read replicas**
- Linear read scaling — add followers.
- Hot-standby for failover.
- Geographic latency reduction (replica per region).

**Cons — Read replicas**
- Replication lag => stale reads.
- Writes still bottlenecked at the single primary.
- "Read your writes" requires routing back to primary or to a synchronous replica.

**Pros — Sharding**
- Linear horizontal scaling for both reads and writes.
- Failure domain shrinks (a shard outage affects a fraction of users).
- Storage scales beyond any single node.

**Cons — Sharding**
- Cross-shard queries are painful — JOINs, aggregations, transactions.
- Re-sharding is operationally brutal.
- Hot shards if the key isn't well-distributed.
- Every query needs a shard key; you'll regret picking the wrong one.

**Rule of thumb:** use replicas first — they're cheap and reversible. Shard only when you've measured the writer wall and accepted you'll be picking a shard key forever.

## Real-world analogies
- Read replicas: branch libraries with copies of the same books — most people never need the central archive.
- Sharding: filing cabinets labeled A-G, H-N, O-T, U-Z — find the cabinet from the name, then go.
- Combined: each branch library also has its own A-Z catalog cabinets.

## Run the demo
```bash
node demo.js
```

The demo runs a single writer with two read replicas (with simulated lag), then a sharded keyspace that hashes user IDs across two shards. We show stale reads from a replica and routing across shards.

## Deeper intuition

Data architecture is where software design meets physical constraints. Reads, writes, consistency, replication, and ownership all have sharp costs. These topics matter because a lot of 'architecture' becomes real only when it hits data movement and storage boundaries.

A strong grasp of **Read Replicas and Sharding** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Read Replicas and Sharding** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Database Per Service or Shared Database instead:** those may still matter, but **Read Replicas and Sharding** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Read Replicas and Sharding everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Read Replicas and Sharding** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Read Replicas and Sharding as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
