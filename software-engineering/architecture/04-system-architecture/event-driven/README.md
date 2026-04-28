# Event-Driven Architecture

**Category:** System Architecture

## Intent
Components communicate by emitting and reacting to **events**, not by calling each other directly. A producer publishes "OrderPlaced"; whoever cares (mailers, inventory, analytics) subscribes and reacts independently. The producer doesn't know — and doesn't need to know — who's listening.

## When to use
- Multiple independent reactions to one business event (one signup → 5 things happen).
- You want to add new reactions without modifying existing producers.
- Workflows are inherently asynchronous (charge, ship, refund — each at its own pace).

## Trade-offs
**Pros**
- Loose coupling: producers don't depend on consumers.
- Open for extension — add a new consumer without touching producers.
- Natural fit for async, eventual workflows.
- Replay-ability when events are durable (an event log becomes the audit trail).

**Cons**
- Hard to follow: "what happens when an Order is placed?" requires grepping subscribers.
- Eventual consistency is the default. Not always what you want.
- Event ordering, retries, deduplication, schema evolution — all must be designed.
- Debugging is detective work; tracing across events needs tooling.

**Rule of thumb:** Use events when reactions are *genuinely independent*. If A → B → C is one logical flow with strict ordering, a synchronous orchestrator is clearer.

## Real-world analogies
- A radio station: the broadcaster doesn't know who's tuned in; listeners come and go.
- A noticeboard: anyone can read; anyone can post; nobody coordinates with anyone.

## Run the demo
```bash
node demo.js
```

The demo defines a tiny in-process event bus. An `OrderPlaced` event triggers two unrelated subscribers (email + inventory) — neither knows about the other.
