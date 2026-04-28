# Publish / Subscribe

**Category:** Communication

## Intent
Publishers emit events to a **topic** without knowing who is listening. Subscribers register interest in a topic and each receive an independent copy of every event. The publisher does not know — and does not care — how many subscribers exist.

## When to use
- One thing happens; many independent reactions need to follow (audit log, email, analytics, cache invalidation).
- You want to add new reactions later without touching the producer.
- The consumers are genuinely independent and can fail in isolation.
- Domain events: `OrderPlaced`, `UserRegistered`, `PaymentFailed`.

## Trade-offs
**Pros**
- Producer is fully decoupled from consumers — open/closed at the system level.
- New subscribers added with zero changes upstream.
- Each consumer can fail, retry, or scale independently.

**Cons**
- Hard to reason about end-to-end behavior — "what happens when X is published?" is no longer in one file.
- Ordering guarantees across topics are weak or absent.
- Each subscriber needs idempotency — events may be redelivered.
- Debugging requires tracing across many handlers; you need correlation IDs.

**Rule of thumb:** reach for pub/sub when one event has many *independent* consequences. If consequences must happen in a strict sequence with shared state, you want a saga or a workflow, not pub/sub.

## Real-world analogies
- A newspaper subscription — the press prints; subscribers receive copies independently.
- A radio broadcast — the station does not track who is listening.
- A Slack channel — anyone in the channel sees the message; the poster does not address them individually.

## Run the demo
```bash
node demo.js
```

The demo defines an `OrderPlaced` topic with three subscribers (email, analytics, warehouse). One publish call fans out to all three; one subscriber throws and the other two are unaffected.
