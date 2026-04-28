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
