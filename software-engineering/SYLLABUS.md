# The Engineering Dojo — A 12-Month Syllabus

A self-directed path from "I write code that works" to "I design systems that survive contact with reality." Three stages, twelve months, ~50 topics. Every topic has three artifacts:

1. **README.md** — the concept, when to use, trade-offs, and analogies.
2. **demo.js** — a runnable example that makes it concrete.
3. **homework.md** — a constrained exercise that forces you to apply the idea, not just describe it.

The constraints in each homework are the point. They're designed so you *can't* shortcut around the concept. Resist the urge to bend them.

---

## How to work through this

For each topic, in order:

1. **Read the README** (10–15 min). Don't skim. The "trade-offs" and "rule of thumb" sections are the most important part — they tell you when *not* to use the pattern.
2. **Run the demo.** `cd <topic-folder> && node demo.js`. Read every line. Modify it. Break it. Print things. Make sure you can predict its output before re-running.
3. **Do the homework** (1–4 hours). Write your code in a scratch folder (suggested: `software-engineering/_solutions/<section>/<topic>/`, gitignored). Hit every "Done when" checkbox before moving on.
4. **Write a one-paragraph retrospective** at the end: what surprised you, what was harder than expected, what you'd do differently next time. A markdown file in your scratch folder is enough.

**Cadence.** Most topics fit in one week of part-time study (5–10 hours). A few need two weeks. The schedule below assumes ~7 hours/week. If you have more, accelerate; if less, give yourself more time per topic — don't skip homework.

**Don't read ahead.** The order matters. Strategy makes Observer click. Observer makes Mediator click. The architecture sections lean on the patterns sections. Trust the sequence.

---

## Stage 1 — Foundations (Months 1–2)

You're not learning patterns yet. You're learning the *vocabulary* that makes patterns make sense. If you don't have these words, every pattern looks like a clever trick instead of a tool.

### Month 1 — Fundamentals (`architecture/01-fundamentals/`)

| Week | Topic | Why it's first |
|------|-------|----------------|
| 1 | separation-of-concerns | Most important word in software design. Everything else is a way of separating concerns. |
| 2 | coupling-and-cohesion | The lens you'll use to evaluate every design call below. |
| 3 | abstraction-and-encapsulation | How to make invariants impossible to violate. |
| 4 | dependency-direction + dry-kiss-yagni | The rule about which way arrows point. The rule about restraint. |

**End-of-month exercise.** Take any small project of yours (≥500 lines). Score it on a 1–5 scale across all four lenses. Identify the worst offender, fix it.

---

### Month 2 — SOLID + Demeter (`architecture/02-principles/`)

| Week | Topic | Notes |
|------|-------|-------|
| 1 | single-responsibility + open-closed | The two most-cited; do them together. |
| 2 | liskov-substitution + interface-segregation | The two most-misunderstood; spend time here. |
| 3 | dependency-inversion | The hinge between "OO classes" and "real architecture." |
| 4 | law-of-demeter | A bonus principle but a strong one. Pairs with everything else. |

**End-of-month exercise.** Find code in a project (yours or open-source) that violates each of the five SOLID principles. Document each violation in 2 sentences. Fix one.

---

## Stage 2 — Patterns (Months 3–6)

Now you have the language. Patterns are *named solutions* to common problems. Knowing the names lets you communicate at design speed.

A warning: don't apply a pattern because you learned it. Apply it because the *problem* matches what the pattern solves. Most "over-engineered" code is a pattern looking for an excuse.

### Month 3 — Creational Patterns (`design-patterns/creational/`)

| Week | Topic | Notes |
|------|-------|-------|
| 1 | singleton + factory-method | When you need a single instance vs when subclasses pick what gets created. |
| 2 | abstract-factory + builder | Families of related objects vs step-by-step construction. |
| 3 | prototype | Cloning vs constructing. Often misunderstood — read carefully. |
| 4 | **Recap project**: Build a small game level editor that uses at least three creational patterns naturally. Don't force them. |

---

### Month 4 — Structural Patterns (`design-patterns/structural/`)

7 patterns; do them in pairs.

| Week | Topic | Notes |
|------|-------|-------|
| 1 | adapter + facade | Two ways of taming an awkward subsystem. Compare them. |
| 2 | bridge + decorator | Classes vs runtime composition for adding behavior. |
| 3 | composite + proxy | Treating leaves and trees uniformly; standing in for the real thing. |
| 4 | flyweight | Sharing fine-grained objects. The least-used pattern but still worth knowing. |

**End-of-month exercise.** Write a 1-page summary contrasting Adapter / Bridge / Decorator / Proxy. They look similar in UML; they aren't. If you can't tell them apart in writing, you don't yet understand them.

---

### Month 5 — Behavioral Patterns, Part 1 (`design-patterns/behavioral/`)

6 of the 11 behavioral patterns — the ones you'll use most often.

| Week | Topic | Notes |
|------|-------|-------|
| 1 | strategy + observer | The two most-used patterns in modern code. Master them. |
| 2 | state + command | Both about behavior-as-objects. |
| 3 | template-method + chain-of-responsibility | Skeletons and pipelines. |
| 4 | **Recap project**: Build an undoable drawing app or a CLI command processor using all six. |

---

### Month 6 — Behavioral Patterns, Part 2 + Capstone

| Week | Topic | Notes |
|------|-------|-------|
| 1 | iterator + mediator | Decoupling traversal; decoupling participants. |
| 2 | memento + interpreter | Saving/restoring state; small DSLs. |
| 3 | visitor | Adding operations without modifying types. The expression problem. |
| 4 | **Capstone** (see below). |

**Stage 2 Capstone — "Design Vocabulary in Action."**
Pick a small system (a Slack bot, a personal-finance tracker, a simple game). Design and implement it using at least 6 distinct GoF patterns *that fit the problem*. Write a 2-page design doc explaining each choice and at least one place where you considered a pattern and **rejected** it. The rejections matter as much as the adoptions.

---

## Stage 3 — Architecture (Months 7–12)

Patterns are about classes. Architecture is about systems. The shift is from "how is one class shaped" to "how do many components fit together, communicate, and survive failure."

### Month 7 — Component Architecture (`architecture/03-component-architecture/`)

| Week | Topic | Notes |
|------|-------|-------|
| 1 | layered + hexagonal-ports-and-adapters | The classic and the better default. |
| 2 | clean-onion | Hexagonal with explicit rings. |
| 3 | mvc-mvp-mvvm | Three siblings for separating UI from logic. |
| 4 | ddd-building-blocks | Entity, value object, aggregate, repository. The most reusable vocabulary in the dojo. |

---

### Month 8 — System Architecture (`architecture/04-system-architecture/`)

| Week | Topic | Notes |
|------|-------|-------|
| 1 | monolith + modular-monolith | The right starting point and its grown-up form. |
| 2 | microservices | Why most "we should be microservices" arguments are wrong. |
| 3 | event-driven + pipes-and-filters | Two ways to compose without tight coupling. |
| 4 | client-server-vs-peer-to-peer | Topology decisions and what each costs. |

**End-of-month exercise.** Take a simple monolith (the todo app from layered, your own, or an open-source one) and write a 2-page proposal for splitting it into microservices. Include the costs honestly. Decide whether you'd actually do it. ("No, modular monolith is enough" is a valid and often correct answer.)

---

### Month 9 — Communication (`architecture/05-communication/`)

8 topics — heaviest month. Two topics per week.

| Week | Topic |
|------|-------|
| 1 | sync-rest-rpc + async-messaging |
| 2 | pub-sub + event-sourcing |
| 3 | cqrs + saga |
| 4 | api-gateway + bff-backend-for-frontend |

**End-of-month exercise.** Sketch the communication topology for a fictional e-commerce system. Decide which interactions are sync, which are async, which are events vs commands. Defend each choice in 1–2 sentences.

---

### Month 10 — Data (`architecture/06-data/`)

| Week | Topic |
|------|-------|
| 1 | database-per-service + shared-database |
| 2 | caching-strategies |
| 3 | read-replicas-and-sharding |
| 4 | cdc-and-outbox |

**End-of-month exercise.** Pick a real read-heavy workload (e.g., a leaderboard) and a write-heavy workload (e.g., an order ingest). For each, design a data architecture. Show your work: which patterns, what trade-offs, what failures you're protecting against.

---

### Month 11 — Resilience and Cross-Cutting (`architecture/07-resilience-and-scale/` + `architecture/08-cross-cutting/`)

| Week | Topic |
|------|-------|
| 1 | retry-and-timeout + circuit-breaker |
| 2 | bulkhead + rate-limiting + load-balancing |
| 3 | idempotency + observability |
| 4 | cap-and-pacelc + fallacies-of-distributed-computing |

**End-of-month exercise.** Pick one production-style service (yours or imagined). Write down its top 5 failure modes. For each, write what *should* happen and how to verify it.

---

### Month 12 — Capstone

You now have the vocabulary, the patterns, and the architectural toolkit.

**The Capstone:**

Build a non-trivial system end-to-end. Suggested options (pick one or invent your own):

1. **A multi-tenant URL shortener.** Including: rate limiting per tenant, analytics events, durable writes, low-latency reads, an admin dashboard.
2. **A small task-queue platform.** Including: producers, workers, retries, dead-letter handling, observability, idempotent task execution.
3. **A real-time collaborative editor (single-document).** Including: operational transforms or CRDTs, presence, offline support, optimistic UI.
4. **A trading or order-matching simulation.** Including: order book, matching engine, audit trail (event sourcing), risk checks.

**Required deliverables:**
- A 5–10 page design doc covering: domain model, system topology, data layout, key trade-offs, failure modes, observability plan.
- Working code (doesn't have to be production-grade — has to be *honest* about what it doesn't do).
- A retrospective: what you'd do differently if you started over now.

There's no rubric, no grade. The point is that **you know what trade-offs you made and why.** That's the difference between an engineer who delivers software and an engineer who designs systems.

---

## Working notes

- **Don't aim for perfect code.** Aim for code that you understand fully, with constraints honestly satisfied.
- **The homework constraints are the point.** Without them, you'll route around the concept.
- **Pair the dojo with reading.** Pick a few books to layer on: *A Philosophy of Software Design* (Ousterhout), *Designing Data-Intensive Applications* (Kleppmann), *Clean Architecture* (Martin), *Domain-Driven Design* (Evans). Don't try to read all four — pick one per quarter.
- **Teach what you learn.** Write a blog post or do a brown-bag talk. Teaching exposes the holes in your understanding.
- **Skip patterns you'll never use.** Interpreter and Flyweight rarely come up; if you've understood them once, that's plenty.
- **Architecture is bigger than this dojo.** It includes things this dojo doesn't cover: security architecture, deployment topology, organizational design, build systems. The 50 topics here are a strong start, not the whole field.

---

## Folder map

```
software-engineering/
├── design-patterns/                   ← Stage 2
│   ├── creational/      (5 patterns)
│   ├── structural/      (7 patterns)
│   └── behavioral/      (11 patterns)
└── architecture/                      ← Stages 1, 3
    ├── 01-fundamentals/               ← Stage 1, Month 1
    ├── 02-principles/                 ← Stage 1, Month 2
    ├── 03-component-architecture/     ← Stage 3, Month 7
    ├── 04-system-architecture/        ← Stage 3, Month 8
    ├── 05-communication/              ← Stage 3, Month 9
    ├── 06-data/                       ← Stage 3, Month 10
    ├── 07-resilience-and-scale/       ← Stage 3, Month 11 (part 1)
    └── 08-cross-cutting/              ← Stage 3, Month 11 (part 2)
```

Twelve months. Fifty topics. One hundred forty-something files. The dojo is the curriculum. The work is yours. Begin.
