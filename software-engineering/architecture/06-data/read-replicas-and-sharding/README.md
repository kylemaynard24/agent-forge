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
