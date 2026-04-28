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
