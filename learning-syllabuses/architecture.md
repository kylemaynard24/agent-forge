# Software architecture — master syllabus (beginner → expert)

Source of truth for the `daily-tasks` skill. Walks you from "I write code that works" to "I design systems that survive contact with reality." Mirrors the architecture portions of `software-engineering/SYLLABUS.md` (Stage 1 fundamentals/principles + Stage 3 architecture), then adds an expert tier that goes beyond the repo.

For each topic the canonical step order is **read → demo → implement**. The "implement" step uses the topic's `homework.md` and writes to `software-engineering/_solutions/<section>/<topic>/`. Expert-tier topics may use a deliverable instead of a homework file.

The skill picks the next topic by `(level, index)` in `state.md`. When a topic's `implement` step is done, advance the index by 1; when the index passes the end of a level, advance the level.

---

## Level 1 — Beginner: Fundamentals + Principles

The vocabulary. Goal: score any small project of yours on these lenses and identify (and fix) the worst offender.

| # | Topic | Path |
|---|---|---|
| 1 | separation-of-concerns | `software-engineering/architecture/01-fundamentals/separation-of-concerns/` |
| 2 | coupling-and-cohesion | `software-engineering/architecture/01-fundamentals/coupling-and-cohesion/` |
| 3 | abstraction-and-encapsulation | `software-engineering/architecture/01-fundamentals/abstraction-and-encapsulation/` |
| 4 | dependency-direction | `software-engineering/architecture/01-fundamentals/dependency-direction/` |
| 5 | dry-kiss-yagni | `software-engineering/architecture/01-fundamentals/dry-kiss-yagni/` |
| 6 | single-responsibility | `software-engineering/architecture/02-principles/single-responsibility/` |
| 7 | open-closed | `software-engineering/architecture/02-principles/open-closed/` |
| 8 | liskov-substitution | `software-engineering/architecture/02-principles/liskov-substitution/` |
| 9 | interface-segregation | `software-engineering/architecture/02-principles/interface-segregation/` |
| 10 | dependency-inversion | `software-engineering/architecture/02-principles/dependency-inversion/` |
| 11 | law-of-demeter | `software-engineering/architecture/02-principles/law-of-demeter/` |

**Level capstone:** find code in a real project (yours or open-source) that violates each of the five SOLID principles. Document each in 2 sentences. Fix one.

---

## Level 2 — Intermediate: Component architecture

How to organize the inside of a single application. Goal: pick the right component shape for a given problem and articulate why.

| # | Topic | Path |
|---|---|---|
| 1 | layered | `software-engineering/architecture/03-component-architecture/layered/` |
| 2 | hexagonal-ports-and-adapters | `software-engineering/architecture/03-component-architecture/hexagonal-ports-and-adapters/` |
| 3 | clean-onion | `software-engineering/architecture/03-component-architecture/clean-onion/` |
| 4 | mvc-mvp-mvvm | `software-engineering/architecture/03-component-architecture/mvc-mvp-mvvm/` |
| 5 | ddd-building-blocks | `software-engineering/architecture/03-component-architecture/ddd-building-blocks/` |

**Level capstone:** take a small app (todo, notes, or similar). Implement it twice: once layered, once hexagonal. Write a 1-page comparison.

---

## Level 3 — Advanced: System architecture + communication + data

How to organize *across* applications. Goal: design the topology, communication style, and data layout for a non-trivial system and defend each choice.

| # | Topic | Path |
|---|---|---|
| 1 | monolith | `software-engineering/architecture/04-system-architecture/monolith/` |
| 2 | modular-monolith | `software-engineering/architecture/04-system-architecture/modular-monolith/` |
| 3 | microservices | `software-engineering/architecture/04-system-architecture/microservices/` |
| 4 | event-driven | `software-engineering/architecture/04-system-architecture/event-driven/` |
| 5 | pipes-and-filters | `software-engineering/architecture/04-system-architecture/pipes-and-filters/` |
| 6 | client-server-vs-peer-to-peer | `software-engineering/architecture/04-system-architecture/client-server-vs-peer-to-peer/` |
| 7 | sync-rest-rpc | `software-engineering/architecture/05-communication/sync-rest-rpc/` |
| 8 | async-messaging | `software-engineering/architecture/05-communication/async-messaging/` |
| 9 | pub-sub | `software-engineering/architecture/05-communication/pub-sub/` |
| 10 | event-sourcing | `software-engineering/architecture/05-communication/event-sourcing/` |
| 11 | cqrs | `software-engineering/architecture/05-communication/cqrs/` |
| 12 | saga | `software-engineering/architecture/05-communication/saga/` |
| 13 | api-gateway | `software-engineering/architecture/05-communication/api-gateway/` |
| 14 | bff-backend-for-frontend | `software-engineering/architecture/05-communication/bff-backend-for-frontend/` |
| 15 | database-per-service | `software-engineering/architecture/06-data/database-per-service/` |
| 16 | shared-database | `software-engineering/architecture/06-data/shared-database/` |
| 17 | caching-strategies | `software-engineering/architecture/06-data/caching-strategies/` |
| 18 | read-replicas-and-sharding | `software-engineering/architecture/06-data/read-replicas-and-sharding/` |
| 19 | cdc-and-outbox | `software-engineering/architecture/06-data/cdc-and-outbox/` |

**Level capstone:** sketch the topology for a fictional e-commerce system: which interactions are sync vs async vs events, which services own which data, which patterns and why. 2 pages.

---

## Level 4 — Expert: Resilience, cross-cutting + capstone (extends beyond repo)

Production realities and original system design. Goal: defend a real system end-to-end including failure modes and cross-cutting concerns.

| # | Topic | Path / source |
|---|---|---|
| 1 | retry-and-timeout | `software-engineering/architecture/07-resilience-and-scale/retry-and-timeout/` |
| 2 | circuit-breaker | `software-engineering/architecture/07-resilience-and-scale/circuit-breaker/` |
| 3 | bulkhead | `software-engineering/architecture/07-resilience-and-scale/bulkhead/` |
| 4 | rate-limiting | `software-engineering/architecture/07-resilience-and-scale/rate-limiting/` |
| 5 | load-balancing | `software-engineering/architecture/07-resilience-and-scale/load-balancing/` |
| 6 | idempotency | `software-engineering/architecture/08-cross-cutting/idempotency/` |
| 7 | observability | `software-engineering/architecture/08-cross-cutting/observability/` |
| 8 | cap-and-pacelc | `software-engineering/architecture/08-cross-cutting/cap-and-pacelc/` |
| 9 | fallacies-of-distributed-computing | `software-engineering/architecture/08-cross-cutting/fallacies-of-distributed-computing/` |
| 10 | repo capstone — build a non-trivial system end-to-end | `software-engineering/SYLLABUS.md` Stage 3 Capstone (URL shortener / task queue / collaborative editor / order matcher) |
| 11 | read *A Philosophy of Software Design* (Ousterhout) — write 1-page synthesis | external. Deliverable in `_solutions/external/` |
| 12 | read *Designing Data-Intensive Applications* (Kleppmann) — chapters of your choice, write 1-page synthesis per part | external |
| 13 | read *Clean Architecture* (Martin) — write 1-page synthesis | external |
| 14 | study one production system's public design doc (e.g., Stripe, Discord, Cloudflare) — write 1-page reading note | external |
| 15 | original capstone — design and (partially) implement a system you'd actually run; honest design doc with failure modes and rejected alternatives | external |

For external topics: no `README.md`/`demo.js`/`homework.md` — the deliverable is the implement step. Skip read/demo for them.

---

## Reading alongside

Pick one per level, don't try to read all:
- *A Philosophy of Software Design* — Ousterhout (Levels 1–2)
- *Designing Data-Intensive Applications* — Kleppmann (Level 3+)
- *Clean Architecture* — Martin (Level 2+)
- *Domain-Driven Design* — Evans (Level 2 component architecture)
- This repo's `READING-LIBRARY.md` for the full bookshelf
