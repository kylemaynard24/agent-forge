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
