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
