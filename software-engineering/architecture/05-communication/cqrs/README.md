# CQRS — Command Query Responsibility Segregation

**Category:** Communication

## Intent
Split your model in two: a **write side** that handles commands and produces events, and a **read side** that maintains denormalized projections optimized for queries. The two sides have different shapes, different scaling characteristics, and often different storage.

## When to use
- Read and write workloads are wildly asymmetric (10,000:1 reads vs writes — typical).
- A single normalized schema cannot serve both transactional integrity and fast queries.
- You already have events (event sourcing pairs naturally with CQRS).
- Different consumers need very different views of the same underlying data.

## Trade-offs
**Pros**
- Read side can be denormalized, indexed, cached, replicated independently.
- Write side stays small, focused on invariants and validation.
- New read models added without touching write code.
- Each side scales independently.

**Cons**
- Two models to maintain — more code, more concepts.
- Read side is **eventually consistent** with the write side; UX must accommodate.
- Debugging "I just wrote it, why can't I read it?" is now a real conversation.
- Often introduced too early; for small apps it is pure overhead.

**Rule of thumb:** introduce CQRS when one model can no longer serve both your write invariants and your read patterns without ugly compromise. Not before.

## Real-world analogies
- A library: the catalog (read view) is updated from acquisitions (write events), but the catalog and the inventory ledger are different artifacts.
- A bank: transactions (write) versus the monthly statement and dashboard (read).
- A newspaper: the newsroom (writes stories) versus the printed edition (read view of the day).

## Run the demo
```bash
node demo.js
```

The demo runs a `Products` write side that accepts commands and appends events, and a read side that subscribes to those events and maintains a denormalized "catalog" view. We issue commands, then query the read view.
