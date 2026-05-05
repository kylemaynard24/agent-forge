# Homework — Indexing

> Trade indexing cost and storage for faster lookup on important access paths.

## Exercise

Work through a small scenario involving a table or collection that is scanned far too often.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Indexing felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Indexing without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, document the why, avoid magic identifiers

An index named `idx3` or `IX_orders_1` is a maintenance liability: when a query plan changes or an index needs to be dropped and rebuilt, no one can tell from the name which queries depend on it, which columns it covers, or why it was created. Naming indexes after their access pattern — `idx_orders_customerId_createdAt_for_history_queries` — makes every migration, explain plan, and performance review self-documenting.

**Exercise:** For the over-scanned table scenario in this homework, design the index you would add and write its name to encode: the table, the leading column(s), any included columns, and the query pattern it supports. Then write the migration comment that explains: the query or access pattern this index targets, the baseline scan count or query time before the index, and the write amplification cost it introduces on inserts and updates.

**Reflection:** In a database schema you manage, could a new engineer look at the index names alone and understand which queries each index was created to accelerate — or would they need to read the query planner output to reconstruct that knowledge?
