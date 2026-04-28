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

## Deeper intuition

Communication patterns are agreements about timing, coupling, ownership, and failure visibility. Every message path answers hidden questions: who waits, who retries, who owns the source of truth, and how much inconsistency the business can tolerate.

A strong grasp of **Publish / Subscribe** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Publish / Subscribe** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with BFF Backend for Frontend or CQRS instead:** those may still matter, but **Publish / Subscribe** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Publish / Subscribe everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Publish / Subscribe** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Publish / Subscribe as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
