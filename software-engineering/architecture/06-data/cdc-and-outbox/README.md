# CDC and Transactional Outbox

**Category:** Data

## Intent
Two patterns that solve the same problem: **how do I reliably publish an event when a row changes, without dual-writes?**

- **Change Data Capture (CDC):** tail the database's write-ahead log; turn committed changes into events. The DB is the single source of truth and the event stream is derived.
- **Transactional Outbox:** in the same DB transaction that updates business state, insert a row into an `outbox` table. A separate process reads new outbox rows and publishes them. The transaction guarantees the event exists if-and-only-if the business write committed.

## When to use
- You write to a DB and need to publish an event reflecting that write — and you cannot accept "wrote DB but failed to publish" or "published but DB rolled back".
- You're building event-driven integrations on top of a relational source of truth.
- You're moving toward CQRS / event sourcing without rewriting the write side first.
- You need a durable event stream derived from existing transactional data.

## Trade-offs
**Pros**
- Eliminates the dual-write race condition for good.
- "If the row exists, the event was published" — strong durability guarantee.
- Outbox: works on any RDBMS without extra infrastructure beyond a poller.
- CDC: zero application code change in many cases.

**Cons**
- Outbox: requires a relay/poller process; adds latency and a moving part.
- CDC: tightly couples your event schema to the DB schema unless you transform.
- Both produce **at-least-once** delivery — consumers must be idempotent.
- Out-of-order delivery is possible; you may need event sequencing.

**Rule of thumb:** if you write `db.save(); bus.publish()` in the same function, you have a dual-write bug waiting to fire. Use outbox or CDC.

## Real-world analogies
- Outbox: a hotel front desk that writes every guest checkout into a logbook *before* contacting housekeeping. The logbook is gospel; housekeeping reads it.
- CDC: a court reporter transcribing every word in real time. The transcript is derived but authoritative.

## Run the demo
```bash
node demo.js
```

The demo writes a row and an outbox entry inside one "transaction". A relay polls the outbox and publishes events. We force a transaction rollback to show the event is correctly **not** published.

## Deeper intuition

Data architecture is where software design meets physical constraints. Reads, writes, consistency, replication, and ownership all have sharp costs. These topics matter because a lot of 'architecture' becomes real only when it hits data movement and storage boundaries.

A strong grasp of **CDC and Transactional Outbox** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **CDC and Transactional Outbox** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Shared Database or Caching Strategies instead:** those may still matter, but **CDC and Transactional Outbox** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply CDC and Transactional Outbox everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **CDC and Transactional Outbox** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat CDC and Transactional Outbox as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
