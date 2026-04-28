# Database Per Service

**Category:** Data

## Intent
Each service owns its data exclusively. No other service touches its tables, its schema, or its database. Cross-service data is fetched via the owning service's API or via events — never via SQL JOINs across services.

## When to use
- You're committed to service autonomy and independent deployability.
- Schemas evolve at very different rates per domain.
- Services have wildly different storage needs (search index vs. relational vs. time-series).
- You need true blast-radius isolation: a runaway query in service A must not impact service B.

## Trade-offs
**Pros**
- True service autonomy — schema changes don't ripple.
- Each service picks the storage that fits its workload.
- Failure isolation — one service's DB outage is local.
- Independent scaling.

**Cons**
- No cross-service JOINs. Reporting and analytics must go through ETL or a query-side projection.
- Distributed transactions are off the table; you need sagas, outbox, or accept eventual consistency.
- More moving parts to operate.
- Data duplication (intentional) creates sync problems.

**Rule of thumb:** if two services share a database, they are one service in a costume. Either accept that and merge them, or split the data and accept the discipline.

## Real-world analogies
- Each department in a company keeps its own filing cabinet; HR doesn't dig through Finance's drawers.
- Two banks: each owns its customers' records; they exchange via wire transfers and statements, not by reading each other's databases.
- Microservices done correctly: every fence labeled.

## Run the demo
```bash
node demo.js
```

The demo runs two services (`UserService`, `OrderService`) with completely separate in-memory stores. To build a "user with orders" view, the caller queries each service through its API — never reaching across.

## Deeper intuition

Data architecture is where software design meets physical constraints. Reads, writes, consistency, replication, and ownership all have sharp costs. These topics matter because a lot of 'architecture' becomes real only when it hits data movement and storage boundaries.

A strong grasp of **Database Per Service** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Database Per Service** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Caching Strategies or CDC and Outbox instead:** those may still matter, but **Database Per Service** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Database Per Service everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Database Per Service** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Database Per Service as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
