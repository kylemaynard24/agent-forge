# Fallacies of Distributed Computing

**Category:** Cross-Cutting

## Intent

Eight assumptions that are tempting in code but wrong in production. Internalize them and your distributed code will look paranoid in the right places.

The eight (Deutsch et al.):
1. The network is reliable.
2. Latency is zero.
3. Bandwidth is infinite.
4. The network is secure.
5. Topology doesn't change.
6. There is one administrator.
7. Transport cost is zero.
8. The network is homogeneous.

## When to use

- Code review of any service that calls another service.
- Designing client SDKs for an API.
- Postmortems — almost every distributed-systems incident is a fallacy made manifest.
- Whenever someone says "let's just call the other service inline."

## Trade-offs

**Pros**
- A short, sharp checklist for distributed code review.
- Names the concrete bug class for each fallacy.
- Pairs with retry, timeout, breaker, idempotency, observability — they are the *answers* to these fallacies.

**Cons**
- Memorizing them doesn't fix anything. You still have to apply them per call.
- Some, like "network is secure," need depth (TLS, mTLS, authn/authz) far beyond a checklist.
- The list is from 1994 — the spirit holds, but the specifics (e.g., bandwidth) have shifted.

**Rule of thumb:** in distributed code, every assumption you'd make for an in-process call is wrong. Plan for it.

## Real-world analogies

- Mailing a letter and assuming it arrives in zero seconds, never gets lost, and goes through one office run by one trusted person.
- A walkie-talkie conversation: muffled, intermittent, sometimes overheard, with bandwidth shared across the channel.
- A relay race where every baton hand-off can drop the baton.

## Run the demo

```bash
node demo.js
```

The demo runs a "naive client" that assumes all eight fallacies and a "correct client" that defends against them, against a simulated unreliable network. The naive client crashes or hangs; the correct client finishes successfully.

## Deeper intuition

Cross-cutting concerns expose the pressures that ignore your clean boxes. Observability, trade-off analysis, distributed-systems fallacies, and CAP-style thinking all exist to remind you that runtime reality cuts across module boundaries and happy-path diagrams.

A strong grasp of **Fallacies of Distributed Computing** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Fallacies of Distributed Computing** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with CAP and PACELC or Observability instead:** those may still matter, but **Fallacies of Distributed Computing** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Fallacies of Distributed Computing everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Fallacies of Distributed Computing** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Fallacies of Distributed Computing as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
