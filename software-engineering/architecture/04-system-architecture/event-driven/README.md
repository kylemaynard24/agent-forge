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

## Deeper intuition

System architecture topics change the unit of thinking from classes to deployable pieces and interaction styles. The important question is no longer just 'is this code clean?' but 'what does this topology make easy, expensive, risky, or organizationally awkward?'

A strong grasp of **Event-Driven Architecture** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Event-Driven Architecture** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Pipes and Filters or Client Server vs Peer to Peer instead:** those may still matter, but **Event-Driven Architecture** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Event-Driven Architecture everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Event-Driven Architecture** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Event-Driven Architecture as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
