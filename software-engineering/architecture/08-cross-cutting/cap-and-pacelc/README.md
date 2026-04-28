# CAP and PACELC

**Category:** Cross-Cutting

## Intent

Reason about distributed-system trade-offs. **CAP**: in the presence of a network **P**artition, you must choose between **C**onsistency and **A**vailability — you cannot have both. **PACELC** completes the picture: even in the *absence* of a partition (**E**lse), you trade **L**atency vs. **C**onsistency. Every distributed datastore makes this choice; understand which one yours has made.

## When to use

- Choosing or evaluating a database, cache, or message broker.
- Designing replication for a stateful service.
- Writing post-mortems where "stale read" or "split-brain" are in the timeline.
- Setting product expectations: "is it OK if a user sometimes sees old data?"

## Trade-offs

**Pros**
- Forces an explicit, conscious choice instead of an accidental one.
- Aligns engineering with product: "do we need correct, or do we need available?"
- Helps explain confusing failure modes ("why did we serve stale data during the outage?")

**Cons**
- The model is reductive — real systems are tunable per-operation, not globally CP or AP.
- "Consistency" in CAP is **linearizability**, which is stricter than what most products call "consistency."
- "Availability" in CAP means *every* request gets a non-error response, not "the system is up."
- Some choices look like CP/AP but are actually neither under the strict definitions.

**Rule of thumb:** during a partition, decide *per request* whether stale-but-fast or correct-but-error fits the use case — and document it.

## Real-world analogies

- An ATM still letting you withdraw cash when offline (chose A) — the bank reconciles later.
- A flight-control system rejecting an instruction it cannot confirm with the redundant unit (chose C).
- A spreadsheet syncing across two laptops on the same plane Wi-Fi — when the connection blips, you can keep editing (A) or freeze the cell (C).

## Run the demo

```bash
node demo.js
```

The demo simulates two replicas. It introduces a partition, then runs the same read under a "CP" policy (return error rather than risk staleness) and an "AP" policy (return possibly-stale data) so you can see the trade-off concretely. It also shows the ELSE side: lower latency at the cost of weaker consistency.
