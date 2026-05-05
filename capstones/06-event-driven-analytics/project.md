# Capstone 06 — Event-Driven Analytics System

## Context

Most systems treat the current state of the database as the truth. When something changes, you update a row. The history of how that row got to its current state is gone. This works fine for simple CRUD applications and creates profound problems for anything that needs auditability, temporal queries, analytics, or the ability to rebuild a view of the data from scratch.

Event sourcing inverts this model: instead of storing current state, you store the sequence of events that produced it. Current state is derived by replaying events. This makes some things much harder (point-in-time queries are now easy; updating a record is now "append an event"). It makes other things much easier (every change is audited; you can rebuild any view from the event log; different consumers can maintain different projections of the same events).

This capstone builds a real event-sourced system with CQRS, multiple projections, and a stream processing layer for analytics. The hard parts are not the code — they are the design decisions about event schema, projection design, and consistency model.

## Primary domains

| Domain | What this capstone exercises |
| --- | --- |
| `architecture` | event-sourcing, CQRS, pub-sub, async-messaging, event-driven |
| `design-patterns` | observer, command, strategy, template method |
| `devops` | stream processing, IaC, observability for event-driven systems |

## What you'll build

Choose a simple domain that has interesting state transitions. Good choices: an e-commerce order lifecycle (placed → paid → shipped → delivered → returned), a task management system (created → assigned → in-progress → completed → archived), or a bank account (opened → deposit → withdrawal → transfer → closed).

**Event store**: the immutable log of all events. Every write to the system produces one or more events appended to the store. Events are never updated or deleted — only appended.

**Command handlers**: receive user intent (create order, pay order, ship order), validate it against the current state, and produce events.

**Projections**: read-side views derived from the event stream. Implement at least three with different shapes:
- A standard state projection (current state of each entity)
- An analytics projection (aggregates: how many orders per day, average order value)
- An activity log projection (every event for a given entity in chronological order)

**Stream processor**: consumes events and produces aggregates in near-real-time. Different from projections — this handles windowed computations (orders in the last hour, rolling 7-day average).

**Rebuild capability**: given the event log, rebuild any projection from scratch. This should produce exactly the same result as the current projection.

## Milestones

### Milestone 1: Event store and first events (3-5 hours)
Design your event schema. Events need: event type, aggregate ID, sequence number, timestamp, payload, and metadata. The sequence number is critical — it prevents concurrent writes from silently overwriting each other.

Implement the event store as an append-only store. Write 3-5 event types for your domain. Verify: you cannot update or delete events. Concurrent appends to the same aggregate either produce a conflict error or serialize correctly.

**Deliverable**: working event store. The event schema documented with an explanation of why each field exists. A test that verifies the optimistic concurrency check (two writers at the same sequence number — who wins?).

---

### Milestone 2: Command handlers and state projection (4-6 hours)
Build command handlers that validate commands against current state and produce events. Build the first projection: current state of each entity by replaying its events.

The current state projection should support: fetch the current state of any entity by ID. The state is derived by replaying all events for that entity, not by reading a stored state record.

**Deliverable**: working command handlers with validation. State projection that correctly reflects all events. A test: create an entity, apply a series of events, verify the final state matches expectations.

---

### Milestone 3: Multiple projections (4-6 hours)
Add two more projections that serve different read patterns:
- An analytics projection (aggregates over all entities: total counts, breakdowns by status, time-series data)
- An activity log projection (all events for a given entity, formatted for human reading)

These projections must be kept in sync with the event store. Decide: are they synchronous (updated in the same transaction as the event append) or asynchronous (updated from an event subscription)? Write an ADR for this decision.

**Deliverable**: all three projections working. An ADR for the sync/async projection update decision. A test: apply 20 events across 5 entities; verify all three projections are consistent.

---

### Milestone 4: Stream processor for analytics (4-8 hours)
Build a stream processor that consumes events and produces analytics in near-real-time. Implement at least two windowed computations:
- Count of events of a specific type in the last N minutes
- Rolling N-day average of a quantitative metric (order value, task completion time, etc.)

The stream processor must handle: out-of-order events (events that arrive late due to clock skew or network delays), duplicate events (events that are delivered more than once), and restarts (it should be possible to restart the processor and resume without reprocessing all history).

**Deliverable**: stream processor with at least two windowed computations. Documentation of how you handle out-of-order and duplicate events. A test that injects out-of-order events and verifies the computation is still correct.

---

### Milestone 5: Projection rebuild (3-5 hours)
Implement the ability to rebuild any projection from scratch from the event log. Tear down a projection's storage, replay all events, and verify the rebuilt projection is identical to the original.

This is the "correctness test" for event sourcing: if the projection and the event log ever disagree, you can rebuild and the event log wins. Test this by manually corrupting a projection and verifying the rebuild produces the correct result.

**Deliverable**: working rebuild capability. A test that corrupts a projection and verifies the rebuild corrects it. A documented runbook: "how to rebuild the analytics projection if it becomes inconsistent."

---

### Milestone 6: Schema evolution (4-6 hours)
Add a new field to an existing event type. Your system must handle both old events (without the field) and new events (with the field) from the same projection code. Implement upcasting: a function that transforms old event versions into the current schema when they are read from the store.

This is the part that reveals whether your event schema was well-designed. If adding a field requires touching 20 projection handlers, the schema had too much coupling. If it requires touching 2, it was well-designed.

**Deliverable**: new field added to an existing event type. Old events still work via upcasting. A post-mortem on your schema design: what did you get right, what would you do differently?

---

### Milestone 7: Full IaC and observability (3-5 hours)
Define all infrastructure in IaC. Add observability specific to event-driven systems: event throughput (events per second), event processing lag (time between event creation and projection update), dead letter queue depth (events that failed to process).

**Deliverable**: complete IaC. A dashboard with event-driven-specific metrics. A documented SLO: "projections are updated within N seconds of the corresponding event being appended."

---

## Technical guidance

**Design your events as if they are public API contracts**. Once an event is in your store, you cannot change its schema without handling backward compatibility. Design for evolution from day one: use additive changes only, never rename or remove fields in a published event schema.

**The sequence number is the hardest part**. Optimistic concurrency on the sequence number is what prevents lost updates. Get this right at milestone 1 — everything else depends on it. Test it with concurrent writes.

**Projections are not your database**. Projections can be rebuilt from scratch. This means they can be wrong (a bug in the projection handler), and fixing the bug + rebuilding restores correctness. Embrace this — it means you can fix data problems without data migrations.

**Out-of-order events are inevitable**. Design for them from the start. What does it mean for your analytics projection when an event timestamped 3 minutes ago arrives after events timestamped now? This is not a theoretical edge case — it is guaranteed to happen in any distributed system.

## Skills to build while working on this capstone

- `/event-replay <aggregate-id>` — replays all events for an aggregate and shows the state at each step
- `/projection-status` — shows the current lag and event count for each projection
- `/schema-diff` — compares event schemas across versions and identifies breaking changes

## Further depth

- `software-engineering/architecture/05-communication/event-sourcing/`
- `software-engineering/architecture/05-communication/cqrs/`
- `software-engineering/architecture/05-communication/pub-sub/`
- `software-engineering/architecture/06-data/cdc-and-outbox/`
