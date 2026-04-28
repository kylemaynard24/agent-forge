# Shared Database

**Category:** Data

## Intent
Multiple services read and write the same database, often the same tables. Often considered an anti-pattern in microservices, but a common pragmatic starting point — and sometimes the right answer for genuinely small systems.

## When to use
- The "services" are really one team's code split for organizational clarity, not for autonomy.
- The whole system is small enough that a single DB is operationally simpler than the alternative.
- You explicitly need cross-domain transactions and aren't ready to invest in sagas.
- A reporting / analytics warehouse that intentionally aggregates from many sources.

## Trade-offs
**Pros**
- Simple: one connection string, one schema, one backup.
- Cross-table queries with full SQL power; ACID transactions across domains.
- No eventual consistency to reason about.
- Lowest operational overhead.

**Cons**
- Any schema change is a coordinated multi-service deploy.
- Implicit coupling: service A depends on internal columns of service B without anyone realizing.
- Lock contention and noisy-neighbor effects across services.
- Blocks independent scaling and independent storage choices.
- Often the source of "we can't change anything without breaking everything".

**Rule of thumb:** start here if the system is genuinely small. Move off it the moment the cost of coordination exceeds the cost of separation. The transition is painful — start measuring early.

## Real-world analogies
- Roommates sharing a single fridge — fine for two people, awful for ten.
- A whiteboard everyone in the office can write on — great for one team, chaos for many.
- A shared spreadsheet that became the company's database.

## Run the demo
```bash
node demo.js
```

The demo runs two services reading and writing the same in-memory `db` object. Then we change the schema (rename a column) and watch both services break — illustrating the coupling.

## Deeper intuition

Data architecture is where software design meets physical constraints. Reads, writes, consistency, replication, and ownership all have sharp costs. These topics matter because a lot of 'architecture' becomes real only when it hits data movement and storage boundaries.

A strong grasp of **Shared Database** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Shared Database** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Caching Strategies or CDC and Outbox instead:** those may still matter, but **Shared Database** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Shared Database everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Shared Database** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Shared Database as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
