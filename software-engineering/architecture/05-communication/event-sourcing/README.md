# Event Sourcing

**Category:** Communication

## Intent
Do not store the current state. Store the **sequence of events** that produced it. Current state is computed by folding (replaying) the event log. The log is the source of truth; everything else is a projection.

## When to use
- Audit and "how did we get here?" are first-class requirements (finance, healthcare, compliance).
- You need temporal queries: "what was the balance on Jan 3?" — just replay up to that timestamp.
- Multiple read models with different shapes are derived from the same write history.
- Recovery and debugging benefit from a complete, immutable history of intent.

## Trade-offs
**Pros**
- Perfect audit trail for free — the log *is* the audit.
- Time travel: rebuild any past state by replaying.
- New projections (read models) can be added later by replaying the existing log.
- Eliminates "lost update" — every change is captured as an event.

**Cons**
- Bigger conceptual jump for the team — events, projections, snapshots, replay.
- Schema evolution is hard: old events live forever; you need event versioning.
- Replays get slow without snapshots.
- Querying current state requires a projection layer; you can't just `SELECT * FROM accounts`.

**Rule of thumb:** if "why did this state happen?" is as important as "what is the state?", event sourcing earns its complexity. Otherwise it is overkill.

## Real-world analogies
- A bank statement — every deposit and withdrawal recorded; balance is derived.
- A chess game's move list — the position is reproducible from the moves.
- Git — the repo state is a fold over commits.

## Run the demo
```bash
node demo.js
```

The demo runs a bank account whose balance is never stored — only `Deposited` and `Withdrew` events. We replay the log to compute the current balance, then replay up to a past point to compute a historical balance.

## Deeper intuition

Communication patterns are agreements about timing, coupling, ownership, and failure visibility. Every message path answers hidden questions: who waits, who retries, who owns the source of truth, and how much inconsistency the business can tolerate.

A strong grasp of **Event Sourcing** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Event Sourcing** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Sync Rest RPC or API Gateway instead:** those may still matter, but **Event Sourcing** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Event Sourcing everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Event Sourcing** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Event Sourcing as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
