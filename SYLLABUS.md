# agent-forge — 3-Class Syllabus

This repo can be studied like three concurrent college classes:

1. **Design Patterns** — object-level design vocabulary and trade-offs
2. **Architecture** — component, system, communication, data, and resilience decisions
3. **Agentic Workflows** — how LLM agents are structured, controlled, and operated

The plan below is intentionally **high-level**. It gives you a semester-like rhythm without pretending every topic takes the same amount of time. Use it as a strong default, not a cage.

## How to run the three classes

Treat each week like a light course load:

- **Design Patterns:** 2 study sessions
- **Architecture:** 2 study sessions
- **Agentic Workflows:** 2 study sessions
- **Lab / synthesis:** 1 session where you compare ideas across tracks or build something small

That cadence gives you a **6-month core path** if you move briskly and a **12-month path** if you stretch the labs, projects, and capstones.

## What counts as "doing the class"

For each topic:

1. Read the README until you can restate the concept without looking.
2. Run the demo and predict the output before you execute it.
3. Change something small and explain why the behavior changed.
4. Write a short note on the trade-off: what problem the concept solves, and what cost it introduces.

If you skip that last step, you will collect terminology faster than judgment.

## Term 1 — Core curriculum (Months 1-6)

This is the shortest serious path through the repo. Finish this and you will have a solid conceptual foundation across all three tracks.

| Month | Design Patterns class | Architecture class | Agentic Workflows class | Lab / deliverable |
| --- | --- | --- | --- | --- |
| **1** | Start with the catalog and high-leverage patterns: Strategy, Observer, Adapter, Singleton | Fundamentals: separation of concerns, coupling/cohesion, abstraction/encapsulation, dependency direction, DRY/KISS/YAGNI | Foundations: what is an agent, the agentic loop, prompts as programs, context as working memory, tools as the world interface | Write a one-page reflection on how "separation of concerns" appears in both code architecture and agent design |
| **2** | Finish Phase 2 of the pattern study path: Decorator, Proxy, Facade | Principles: SRP, OCP, LSP, ISP, DIP, Law of Demeter | Single-agent design: system prompt anatomy, structured output, plans and tasks, tool design principles, tool-result handling, memory patterns, error handling and recovery | Build a tiny toy agent and annotate where each prompt section or tool contract maps to a software design principle |
| **3** | Creational patterns: Factory Method, Abstract Factory, Builder, Prototype | Component architecture: layered, hexagonal, clean/onion, MVC/MVP/MVVM, DDD building blocks | Claude Code primitives: subagents, slash commands, skills, hooks, MCP servers, settings and permissions | Design a small app and describe both its software architecture and the agent tooling you would want around it |
| **4** | Behavioral patterns, part 1: State, Command, Template Method, Chain of Responsibility | System architecture: monolith, modular monolith, microservices, event-driven, pipes and filters, client-server vs peer-to-peer | Multi-agent patterns: orchestrator-worker, sequential pipeline, parallel fan-out/fan-in, hand-off vs delegation, critic-reviewer, hierarchical | Compare a single-agent solution and a multi-agent solution for the same task; explain where coordination helps and where it adds drag |
| **5** | Behavioral patterns, part 2: Iterator, Mediator, Memento, Visitor, Interpreter | Communication + data, first pass: sync REST/RPC, async messaging, pub/sub, CQRS, saga, API gateway, BFF, shared database, database per service | Reliability and ops: guardrails, evals for agents, observability and tracing, cost and latency control, failure modes, human-in-the-loop | Draw a communication diagram for a system that includes both software services and agent workers |
| **6** | Review all 23 patterns by comparison, not memorization | Data + resilience + cross-cutting: caching, read replicas and sharding, CDC and outbox, retry and timeout, circuit breaker, bulkhead, rate limiting, load balancing, idempotency, observability, CAP/PACELC, fallacies of distributed computing, trade-off analysis | Building for real: autonomy gradient, tool API design, prompt versioning and regression tests, long-running agents, capstone design an agent | Capstone: produce a design doc for a non-trivial system that includes both conventional architecture and an agentic subsystem |

## Term 2 — Extension and mastery (Months 7-12)

If you want the slower, deeper college-style version, use the next six months to revisit the same material at higher resolution.

| Month | Design Patterns class | Architecture class | Agentic Workflows class | Lab / deliverable |
| --- | --- | --- | --- | --- |
| **7** | Re-run the demos and rewrite 5 of them from scratch without looking | Revisit fundamentals and principles by critiquing a real codebase | Revisit foundations and single-agent design by improving a small agent you already built | Create a "mistakes I now notice" document across all three tracks |
| **8** | Do comparison essays: Strategy vs State, Adapter vs Facade, Decorator vs Proxy, Command vs Memento, Observer vs Mediator | Revisit component and system architecture with one system you know well | Revisit Claude Code primitives by packaging repeated workflows into reusable commands, skills, or agents | Submit one architecture review of an existing project and one agent design review of an existing workflow |
| **9** | Build one project that uses 4-6 patterns naturally and justify every pattern choice | Focus on communication and data trade-offs in that same project | Add agent support to the project and decide what should remain deterministic versus agentic | Write a short design review defending every synchronous, asynchronous, and tool-mediated boundary |
| **10** | Study the rare patterns until you can recognize them even if you do not prefer them | Focus on resilience, failure modes, and cross-cutting concerns | Add evals, tracing, guardrails, and human checkpoints to the agentic parts | Run tabletop failure exercises: "what breaks first and how would I know?" |
| **11** | Teach the patterns back: summaries, diagrams, or mini demos in your own words | Produce a full architecture document for one medium-sized system | Produce a full operating model for one agentic system | Create a portfolio-quality write-up that combines code shape, system shape, and agent shape |
| **12** | Final review and retention pass | Final review and retention pass | Final review and retention pass | Final capstone: build, document, and retrospect on an end-to-end system you can explain with confidence |

## Recommended "lecture order" inside each class

### Design Patterns

Use the study path in [software-engineering/design-patterns/README.md](software-engineering/design-patterns/README.md). It already sequences the 23 GoF patterns in a teaching order rather than a taxonomy order.

### Architecture

Use the staged order already implied by [software-engineering/SYLLABUS.md](software-engineering/SYLLABUS.md):

1. Fundamentals
2. Principles
3. Component architecture
4. System architecture
5. Communication
6. Data
7. Resilience and scale
8. Cross-cutting concerns

### Agentic Workflows

Use the repo's stage order:

1. Foundations
2. Single-agent design
3. Claude Code primitives
4. Multi-agent patterns
5. Reliability and ops
6. Building for real

## What "passing" each class should mean

You are not trying to finish every file. You are trying to reach a point where you can **reason under pressure**.

**Design Patterns:** you can distinguish similar patterns by intent and explain when not to use them.

**Architecture:** you can describe a system in terms of boundaries, trade-offs, communication, data ownership, and failure handling.

**Agentic Workflows:** you can explain how an agent behaves, what controls it, where it can fail, and what makes it safe or unsafe to trust.

## Final advice

Keep the three classes connected. The best learning in this repo happens when you notice that the same ideas recur at different scales:

- isolation of change
- explicit interfaces
- controlled indirection
- ownership of state
- recoverability under failure

That is the through-line from a small pattern like **Strategy** to a large system choice like **CQRS** to an agent design choice like **structured output**.
