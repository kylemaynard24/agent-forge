# agent-forge

`agent-forge` is a learning repo for two related subjects:

1. **How good software gets designed** — principles, architecture, and classic design patterns.
2. **How capable LLM agents get built** — prompts, tools, memory, orchestration, and production guardrails.

The repository is organized so you can move from concept -> runnable example -> practice loop instead of collecting disconnected notes. Most folders are intentionally small and self-contained so you can study one idea at a time without losing the larger map.

## What this repository contains

This repository is a guided curriculum, not just a folder of notes. It mixes:

- **Concept explainers** so you can understand an idea in plain language
- **Runnable demos** so the idea becomes concrete instead of abstract
- **Homework and exercises** so you can practice instead of only recognize
- **Reference docs and examples** so you can see how agent tooling is actually assembled

At a high level, the repository is split into four big areas:

| Area | What it is for |
| --- | --- |
| [software-engineering/](software-engineering/) | The broad software design curriculum: architecture, principles, and design patterns |
| [agentic-workflows/](agentic-workflows/) | A staged course on how LLM agents work, how to design them, and how to operate them safely |
| [examples/](examples/) | Working examples of Claude Code primitives such as agents, commands, skills, and hooks |
| [docs/](docs/) | Practical reference material for Claude Code concepts and terminology |

The result is a repo that teaches across multiple scales: object design, component boundaries, system architecture, and agent behavior.

## The three learning tracks

Treat the repo like three parallel classes:

| Track | What it teaches you to notice | Where to start |
| --- | --- | --- |
| **Design patterns** | Reusable object-level solutions and the trade-offs behind them | [software-engineering/design-patterns/](software-engineering/design-patterns/) |
| **Architecture** | System boundaries, communication, data, scale, and failure | [software-engineering/](software-engineering/) and [software-engineering/SYLLABUS.md](software-engineering/SYLLABUS.md) |
| **Agentic workflows** | How LLM agents are structured, controlled, and operated | [agentic-workflows/01-foundations/](agentic-workflows/01-foundations/) |

If you want a semester-style plan across all three, use [SYLLABUS.md](SYLLABUS.md). The same high-level path is summarized below so the top-level README can act as the front door to the whole curriculum.

## How the materials work

The repo uses a repeatable teaching shape:

- **`README.md`** explains the concept, the design pressure behind it, and what trade-offs matter.
- **`demo.js`** makes the idea concrete with a small runnable example.
- **`homework.md`** appears in many topics and forces you to apply the idea under constraints.

The key habit is to treat each concept as a design decision, not a vocabulary word. Reading definitions is useful. Being able to explain when *not* to use the idea is what turns it into working knowledge.

## A practical study loop

For any topic folder:

1. Read the README slowly enough to restate the concept in your own words.
2. Run the demo and predict what it will do before you execute it.
3. Change one thing in the demo and explain why the behavior changed.
4. Do the homework or build a tiny variant from scratch.
5. Write down the trade-off the concept is buying you and the cost you are paying for it.

That last step matters. Most people can recognize a pattern after they have seen it. Stronger engineers can explain the pressure that made it a reasonable choice.

## Repository map

- [docs/](docs/) — practical reference material for Claude Code concepts, primitives, and terminology
- [examples/](examples/) — working examples of agents, commands, skills, hooks, and orchestration
- [agentic-workflows/](agentic-workflows/) — staged curriculum for understanding and building agents
- [software-engineering/](software-engineering/) — design patterns, architecture topics, and the engineering syllabus

## Call to action: study this repo like three college classes

The highest-leverage way to use this repository is to treat it like a **6-12 month curriculum** with three concurrent classes:

1. **Design Patterns** — learn reusable object-level solutions and how to distinguish similar patterns by intent
2. **Architecture** — learn boundaries, communication styles, data decisions, scaling pressures, and resilience trade-offs
3. **Agentic Workflows** — learn how agents think, act, recover, coordinate, and become safe enough for real use

Run them in parallel. That is the point. You want the ideas to reinforce each other instead of living in isolated buckets.

### Weekly cadence

Use a steady, college-like rhythm:

- **2 sessions:** Design Patterns
- **2 sessions:** Architecture
- **2 sessions:** Agentic Workflows
- **1 session:** Lab / synthesis / project work

That pace gives you a **serious 6-month core path** and a **deeper 12-month mastery path** if you stretch the labs, writing, and capstones.

### Months 1-6: core path

| Month | Design Patterns class | Architecture class | Agentic Workflows class | Lab / output |
| --- | --- | --- | --- | --- |
| **1** | Strategy, Observer, Adapter, Singleton | Fundamentals: separation of concerns, coupling/cohesion, abstraction/encapsulation, dependency direction, DRY/KISS/YAGNI | Foundations: what is an agent, the agentic loop, prompts as programs, context as working memory, tools as the world interface | Write one page on how separation of concerns appears in both system design and agent design |
| **2** | Decorator, Proxy, Facade | Principles: SRP, OCP, LSP, ISP, DIP, Law of Demeter | Single-agent design: system prompt anatomy, structured output, plans and tasks, tool design principles, tool-result handling, memory patterns, error handling and recovery | Build a toy agent and annotate where its design mirrors software design principles |
| **3** | Factory Method, Abstract Factory, Builder, Prototype | Component architecture: layered, hexagonal, clean/onion, MVC/MVP/MVVM, DDD building blocks | Claude Code primitives: subagents, slash commands, skills, hooks, MCP servers, settings and permissions | Design a small app and explain both its software architecture and its agent tooling surface |
| **4** | State, Command, Template Method, Chain of Responsibility | System architecture: monolith, modular monolith, microservices, event-driven, pipes and filters, client-server vs peer-to-peer | Multi-agent patterns: orchestrator-worker, sequential pipeline, parallel fan-out/fan-in, hand-off vs delegation, critic-reviewer, hierarchical | Compare one single-agent solution and one multi-agent solution to the same task |
| **5** | Iterator, Mediator, Memento, Visitor, Interpreter | Communication and data, first pass: sync REST/RPC, async messaging, pub/sub, CQRS, saga, API gateway, BFF, shared database, database per service | Reliability and ops: guardrails, evals, observability and tracing, cost and latency control, failure modes, human-in-the-loop | Draw a system diagram that includes both conventional services and agent workers |
| **6** | Review all 23 patterns by comparison instead of memorization | Data, resilience, and cross-cutting: caching, replicas, sharding, outbox, retry/timeout, circuit breaker, bulkhead, rate limiting, load balancing, idempotency, observability, CAP/PACELC, distributed systems fallacies, trade-off analysis | Building for real: autonomy gradient, tool API design, prompt versioning and regression tests, long-running agents, capstone design an agent | Write a capstone design doc for a system that includes both software architecture and an agentic subsystem |

### Months 7-12: mastery path

| Month | Design Patterns class | Architecture class | Agentic Workflows class | Lab / output |
| --- | --- | --- | --- | --- |
| **7** | Rebuild pattern demos from memory and compare similar patterns in writing | Revisit fundamentals and principles by critiquing a real codebase | Improve a small agent you already built and tighten its prompts, tools, and outputs | Create a "mistakes I notice now" document across all three tracks |
| **8** | Write comparison essays: Strategy vs State, Adapter vs Facade, Decorator vs Proxy, Command vs Memento, Observer vs Mediator | Revisit component and system architecture using one system you know well | Package repeated workflows into reusable commands, skills, or subagents | Produce one architecture review and one agent design review |
| **9** | Build one project that uses 4-6 patterns naturally | Focus on communication and data trade-offs inside that project | Add agent support and decide what should stay deterministic versus agentic | Defend every major boundary in a short design review |
| **10** | Study the rarer patterns until you can recognize them even if you rarely use them | Focus on resilience, failure modes, and cross-cutting behavior | Add evals, tracing, guardrails, and human checkpoints to the agentic parts | Run tabletop exercises on what breaks first and how you would know |
| **11** | Teach the patterns back in your own words through summaries or mini demos | Produce a full architecture document for a medium-sized system | Produce a full operating model for an agentic system | Create a portfolio-quality write-up that combines code shape, system shape, and agent shape |
| **12** | Final review and retention pass | Final review and retention pass | Final review and retention pass | Build and retrospect on an end-to-end capstone you can explain with confidence |

### Monthly homework: one project per class, plus one connector project

If you want to attack the syllabus like a real course load, each month should produce **four artifacts**:

1. a **Design Patterns project**
2. an **Architecture project**
3. an **Agentic Workflows project**
4. an **Integrated project** that connects all three

#### Core months (1-6)

| Month | Design Patterns homework | Architecture homework | Agentic Workflows homework | Integrated homework |
| --- | --- | --- | --- | --- |
| **1** | Build a small **notification rules engine** using Strategy for channel selection, Observer for subscriptions, Adapter for one awkward provider, and a minimal singleton-style config entry point. | Refactor or design a small app so concerns are clearly separated into domain logic, IO, and UI/CLI edges; write a short critique of coupling and cohesion. | Build a **minimal loop agent** with 2-3 fake tools and a stub model; log every think -> act -> observe step. | Create a **personal study coach CLI** that uses your rules engine, keeps boundaries clean, and lets a tiny agent choose the next study action. |
| **2** | Build a **wrapped API client** that uses Facade to simplify usage, Proxy for caching or authorization, and Decorator for logging/metrics. | Take a messy service and rewrite it to better honor SOLID and Law of Demeter; document one before/after dependency graph. | Build a **structured-output assistant** with a strong system prompt, explicit schema, task planning, and recovery rules for bad tool results. | Build a **code-review helper** that exposes a clean facade, routes requests through wrappers, and returns structured agent judgments plus retryable failures. |
| **3** | Build a **project scaffolder** or object factory toolkit using Factory Method, Abstract Factory, Builder, and Prototype where each choice has a clear reason. | Design the same domain in layered, hexagonal, or clean/onion style; implement one slice end-to-end with explicit ports and adapters. | Package your agent work into Claude Code-style primitives: one command, one skill, one hook, and one specialist subagent. | Build a **ticket triage workspace** whose app architecture is hexagonal, whose creation flows use creational patterns, and whose agent surfaces are packaged as reusable primitives. |
| **4** | Build a **workflow engine** or command processor using State, Command, Template Method, and Chain of Responsibility. | Model one system twice: once as a monolith or modular monolith, once as microservices or event-driven; explain which you would actually ship. | Build a **multi-agent orchestration demo** with one orchestrator and at least two workers using a deliberate coordination pattern. | Build a **release-management simulator** where workflow objects use behavioral patterns, system boundaries are explicit, and agents collaborate on planning, review, and rollout. |
| **5** | Build a **document or graph explorer** that naturally uses Iterator, Mediator, Memento, Visitor, or Interpreter for traversal, coordination, snapshots, or mini-language support. | Design an **evented business flow** with sync and async boundaries, a read/write split where appropriate, and a clear data ownership story. | Add **guardrails, evals, observability, and human checkpoints** to an existing agent project; produce a short failure report. | Build an **operations desk** or **incident assistant** where services communicate through explicit patterns and agents help investigate, summarize, and route work safely. |
| **6** | Revisit your earlier pattern projects and either consolidate them into one coherent library or rebuild one from scratch with cleaner pattern choices. | Add reliability and cross-cutting behavior: retries, idempotency, caching, tracing, and trade-off analysis for one non-trivial system. | Build a **long-running or stateful agent** with prompt versioning, tool APIs, and a clear autonomy boundary. | Build a **capstone platform** such as a support desk, task queue, or internal ops tool that includes a real software architecture plus one agentic subsystem with clear guardrails. |

#### Mastery months (7-12)

| Month | Design Patterns homework | Architecture homework | Agentic Workflows homework | Integrated homework |
| --- | --- | --- | --- | --- |
| **7** | Rebuild 3-5 earlier pattern exercises from memory and write what changed in your design instincts. | Audit a real codebase for concerns, coupling, cohesion, and dependency direction; propose a repair plan. | Take an older agent and reduce prompt ambiguity, improve tool contracts, and tighten memory usage. | Rebuild your Month 1 integrated project with better boundaries and a better agent loop; compare versions honestly. |
| **8** | Write and code **comparison projects** for commonly confused siblings such as Strategy vs State and Decorator vs Proxy. | Redesign one known system using alternate component architectures and defend your final choice. | Turn recurring work into reusable commands, skills, subagents, or hooks and document when each should fire. | Build a **review studio** where architecture analysis, pattern recognition, and agent packaging all support the same workflow. |
| **9** | Build one medium project using 4-6 patterns naturally and justify every one you kept or rejected. | Write a full communication and data design for that same project, including failure-handling choices. | Add agent capabilities only where they outperform deterministic code; document what stayed non-agentic and why. | Deliver a **single product** that includes code patterns, system topology, and agent automation as one coherent design instead of three stitched-on demos. |
| **10** | Implement one rare pattern well enough to teach it, even if you would rarely choose it in production. | Run resilience drills against your system: rate limits, retries, partial outages, stale reads, degraded modes. | Add regression tests, eval suites, traces, approval gates, and escalation paths to the agentic pieces. | Run a **tabletop operations month** for your integrated system: break it, observe it, repair it, and write the postmortem. |
| **11** | Produce teach-back artifacts: diagrams, mini demos, and explanations in your own words. | Write a portfolio-grade architecture document for a medium-sized system. | Write a portfolio-grade operating model for an agentic subsystem, including boundaries and risks. | Build a **showcase repo or portfolio case study** that explains object design, architecture, and agent design in one narrative. |
| **12** | Do a final pattern retention pass by implementing one fresh problem with only the patterns that truly fit. | Do a final architecture retention pass by redrawing the whole system from memory and defending its trade-offs. | Do a final agent retention pass by simplifying one agent until only the necessary mechanisms remain. | Ship a final **end-to-end capstone** and include code, design docs, ops notes, and a retrospective on what you now understand that you did not in Month 1. |

#### Homework rule of thumb

For every monthly assignment, force yourself to answer four questions in writing:

- **Why this pattern or architecture?**
- **What simpler option did I reject?**
- **What failure mode am I designing for?**
- **What part should stay deterministic instead of agentic?**

That reflection is what turns the projects into real coursework instead of a pile of demos.

### What "passing" these three classes means

**Design Patterns:** you can distinguish similar patterns by intent and explain when not to use them.

**Architecture:** you can describe a system in terms of boundaries, trade-offs, communication, data ownership, and failure handling.

**Agentic Workflows:** you can explain how an agent behaves, what controls it, where it can fail, and what makes it trustworthy or risky.

### After the first three classes: the top-5% engineer track

Once the first three classes are in place, the next jump is not more vocabulary. It is better performance under pressure. That means learning the things strong engineers are unusually good at in real environments:

1. finding root cause in messy systems
2. designing effective test strategy instead of just writing tests
3. improving performance with evidence instead of guesswork
4. seeing security and trust boundaries early
5. changing legacy systems without breaking them
6. operating software during failure, not just during demos
7. writing design docs, reviews, and postmortems that move teams forward

### Advanced sequence after the first year

Use this as the next phase after the three-class foundation. It can be done in **6 months aggressively** or **12 months with deeper project work**.

| Month | Advanced class | What it trains |
| --- | --- | --- |
| **13** | Debugging and Diagnostics | Hypothesis-driven debugging, repro minimization, trace reading, root-cause discipline |
| **14** | Testing and Verification | Test strategy, contract thinking, integration boundaries, flaky test diagnosis |
| **15** | Performance and Capacity | Profiling, latency budgets, backpressure, memory discipline, bottleneck analysis |
| **16** | Security and Trust Boundaries | Threat modeling, authn/authz, secrets handling, validation, multi-tenant thinking |
| **17** | Legacy Rescue and Refactoring | Seam creation, strangler moves, safe modernization, behavior-preserving change |
| **18** | Incident Response and Engineering Execution | Runbooks, on-call thinking, observability, postmortems, design docs, ADRs, code review quality |

### Advanced homework pattern

For each advanced month, produce five outputs:

1. **working code or a realistic system change**
2. **tests or validation evidence**
3. **a short design note**
4. **a runbook or operational checklist**
5. **a retrospective or postmortem**

That combination is what shifts this platform from "strong study repo" to "serious engineer training ground."

### Suggested advanced projects

| Month | Homework project |
| --- | --- |
| **13** | Take a deliberately broken service or toy system, reproduce three bugs, and write root-cause reports with fixes ranked by confidence |
| **14** | Build or refactor a service so it has a deliberate unit/integration/contract test strategy, then document what you chose not to test |
| **15** | Profile one read-heavy and one write-heavy path, then improve the slowest path with measurements before and after |
| **16** | Perform a lightweight threat model on a small app, then harden authentication, authorization, input handling, and secrets usage |
| **17** | Take a messy or older project and modernize one part of it using seams, adapters, or a strangler-style migration plan |
| **18** | Run an incident simulation on your integrated system: detect, triage, mitigate, communicate, and publish a postmortem plus follow-up plan |

The concrete materials for this advanced phase live in [software-engineering/advanced-engineering/](software-engineering/advanced-engineering/).

### Best next step inside the repo

- Start with [software-engineering/design-patterns/README.md](software-engineering/design-patterns/README.md) for the pattern study path
- Use [software-engineering/SYLLABUS.md](software-engineering/SYLLABUS.md) for the deeper engineering sequence
- Start [agentic-workflows/01-foundations/what-is-an-agent/](agentic-workflows/01-foundations/what-is-an-agent/) for the agent track
- Use [SYLLABUS.md](SYLLABUS.md) if you want the standalone version of this top-level study plan

## Running the repo

Most runnable materials are plain Node scripts:

```bash
node path/to/demo.js
```

The `.claude/` examples in `examples/` are meant to be used by launching Claude Code from this repository root so the project-scoped agents, commands, and skills are available.

## What "understanding the repo" should feel like

By the time you're comfortable here, you should be able to move fluidly between scales:

- from a single class-level pattern like **Strategy**
- to a subsystem boundary like **Hexagonal Architecture**
- to an operational agent concern like **tool-result handling** or **guardrails**

That scale-shifting is the point of the repo. Good engineering and good agent design both come down to the same habits: isolate change, make boundaries explicit, choose the right amount of indirection, and stay honest about trade-offs.
