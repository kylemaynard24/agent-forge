# Homework — Read Replicas and Sharding

> Apply replication and partitioning. The **constraints** are the point.

## Exercise: Scale a fake user DB

**Scenario:** A user DB receives 90% reads, 10% writes. The single primary is saturating. You have headroom in dollars but not in code complexity.

**Build:**
- A `Primary` with two `Replica`s, each with a configurable lag (50ms, 250ms).
- A read-routing function that prefers a replica but falls back to primary on a "read your writes" flag.
- A 4-shard router using consistent hashing on `user_id`. Print the distribution across shards for 10,000 keys.
- A "list all users" query that demonstrates cross-shard fan-out and result merging.

**Constraints (these enforce the concept):**
- Writes go to the primary only. Replicas must be readable but not writable — enforce this in the API.
- Reads with the `readYourWrites=true` flag must hit the primary; without it, prefer a replica.
- The shard router must be deterministic — same `user_id` always routes to the same shard.
- Cross-shard queries must explicitly fan out and merge. No magic JOIN.

## Stretch
- Implement a re-shard from 4 to 6 shards. Print which keys must move.
- Add a regional replica with 500ms lag. When is it acceptable to read from it?

## Reflection
- A user complains: "I changed my email but the page still shows the old one." Walk through the most likely cause and the routing fix.

## Done when
- [ ] Replication lag visible in stale-read scenario.
- [ ] 10,000 keys spread roughly evenly across 4 shards.
- [ ] One demonstrable cross-shard query.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — shard key names and routing function names must eliminate ambiguity

A shard router function named `getNode(id)` is ambiguous about which `id` is the shard key, what the return value represents, and whether it is stable under re-sharding; `shardForUserId(userId): ShardId` encodes the key domain, the key type, and the return type in the name, making a misuse visible at the call site. An ambiguous shard key name is not a style issue — it is a production incident waiting to happen when a developer passes the wrong identifier.

**Exercise:** Rename your shard routing function and every variable that holds a shard identifier so that the key domain and the return type are explicit in the name. Then add a single JSDoc/docstring comment to the routing function documenting the one field that is the shard key, why it was chosen, and what the consequence is of changing it after data exists.

**Reflection:** If a new engineer added a cross-shard query that accidentally used `productId` instead of `userId` as the routing key, what in your current naming would catch the mistake — and what would not?
