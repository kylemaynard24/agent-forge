# Pipes and Filters

**Category:** System Architecture

## Intent
Compose computation as a **pipeline of stages** (filters), each transforming its input and passing it on through a **pipe** (channel/stream). Stages are independent; you can rearrange, swap, or insert them.

The Unix shell (`grep | sort | uniq -c | head -10`) is the canonical example.

## When to use
- A sequence of independent transformations on streaming data.
- ETL: extract, transform, load.
- Compilers, image processing, log processing, audio mixing.
- When stages are independently testable and reusable across pipelines.

## Trade-offs
**Pros**
- Simple mental model: data flows through stages.
- Stages are highly reusable (a `tokenize` filter works in many pipelines).
- Stages are independently testable.
- Easy to parallelize: each stage can run on its own thread/process.

**Cons**
- Each stage's output schema must agree with the next's input schema. Mismatches at the wrong place are confusing.
- State that crosses stages becomes awkward (you end up passing context blobs).
- Errors mid-pipeline need a clear story (drop? retry? dead-letter?).

**Rule of thumb:** Pipes-and-filters is at its best when each stage is **stateless** and **does one thing.** When stages need to share state, you're heading back into a different architecture.

## Real-world analogies
- A car wash: pre-rinse → soap → scrub → rinse → dry. Each station does one thing; pull a station out and the line still runs.
- A factory assembly line.
- A musical signal chain: pickup → compressor → distortion → reverb → amp.

## Run the demo
```bash
node demo.js
```

The demo runs a text pipeline: `lowercase → strip-punct → tokenize → count`, showing how each filter can be composed, swapped, or replaced.

## Deeper intuition

System architecture topics change the unit of thinking from classes to deployable pieces and interaction styles. The important question is no longer just 'is this code clean?' but 'what does this topology make easy, expensive, risky, or organizationally awkward?'

A strong grasp of **Pipes and Filters** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Pipes and Filters** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Modular Monolith or Monolith instead:** those may still matter, but **Pipes and Filters** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Pipes and Filters everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Pipes and Filters** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Pipes and Filters as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
