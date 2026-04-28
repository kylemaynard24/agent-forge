# Asynchronous Messaging

**Category:** Communication

## Intent
Producer hands a message to a queue and immediately moves on. A consumer pulls from the queue and processes when it is ready. The producer and consumer are decoupled in time, throughput, and availability.

## When to use
- The producer does not need the result to make progress (fire-and-forget work, notifications, background jobs).
- Consumer throughput is variable or slower than producer throughput — the queue absorbs spikes.
- You want the consumer to be down for maintenance without dropping work.
- Workloads that are naturally batch-friendly: emails, image processing, analytics ingestion.

## Trade-offs
**Pros**
- Producer is not blocked by consumer latency or downtime.
- Backpressure: bursts queue up instead of overloading downstream.
- Easy horizontal scaling — add more consumers.
- Failure isolation — a slow consumer no longer kills the producer.

**Cons**
- No immediate result — caller must accept eventual processing.
- Adds a stateful component (the queue) that must be operated, monitored, and recovered.
- Ordering, deduplication, and exactly-once semantics are surprisingly hard.
- Debugging is harder — work happens "later, somewhere else".

**Rule of thumb:** if the caller does not need the answer right now, async messaging is almost always the better default at scale.

## Real-world analogies
- A mailbox — the sender drops a letter and walks away; the recipient reads it later.
- A restaurant ticket rail — the server clips orders, the kitchen pulls them off at its own pace.
- An airport baggage belt — bags pile up if the handlers are slow; nothing is dropped.

## Run the demo
```bash
node demo.js
```

The demo runs a producer that enqueues 5 jobs in under 10ms and a slow consumer that takes 200ms per job. The producer finishes immediately while the consumer drains the queue in the background.
