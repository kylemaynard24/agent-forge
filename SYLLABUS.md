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

## Monthly homework: one project per class, plus one connector project

To make the syllabus feel like real classes instead of a reading list, give yourself **four outputs every month**:

1. a **Design Patterns project**
2. an **Architecture project**
3. an **Agentic Workflows project**
4. an **Integrated project** that connects all three

This lets you practice each area independently while also training the skill that matters most in real work: combining local code design, system design, and agent behavior into one coherent solution.

### Core months (1-6)

| Month | Design Patterns homework | Architecture homework | Agentic Workflows homework | Integrated homework |
| --- | --- | --- | --- | --- |
| **1** | Build a small **notification rules engine** using Strategy for channel selection, Observer for subscriptions, Adapter for one awkward provider, and a minimal singleton-style config entry point. | Refactor or design a small app so concerns are clearly separated into domain logic, IO, and UI/CLI edges; write a short critique of coupling and cohesion. | Build a **minimal loop agent** with 2-3 fake tools and a stub model; log every think -> act -> observe step. | Create a **personal study coach CLI** that uses your rules engine, keeps boundaries clean, and lets a tiny agent choose the next study action. |
| **2** | Build a **wrapped API client** that uses Facade to simplify usage, Proxy for caching or authorization, and Decorator for logging/metrics. | Take a messy service and rewrite it to better honor SOLID and Law of Demeter; document one before/after dependency graph. | Build a **structured-output assistant** with a strong system prompt, explicit schema, task planning, and recovery rules for bad tool results. | Build a **code-review helper** that exposes a clean facade, routes requests through wrappers, and returns structured agent judgments plus retryable failures. |
| **3** | Build a **project scaffolder** or object factory toolkit using Factory Method, Abstract Factory, Builder, and Prototype where each choice has a clear reason. | Design the same domain in layered, hexagonal, or clean/onion style; implement one slice end-to-end with explicit ports and adapters. | Package your agent work into Claude Code-style primitives: one command, one skill, one hook, and one specialist subagent. | Build a **ticket triage workspace** whose app architecture is hexagonal, whose creation flows use creational patterns, and whose agent surfaces are packaged as reusable primitives. |
| **4** | Build a **workflow engine** or command processor using State, Command, Template Method, and Chain of Responsibility. | Model one system twice: once as a monolith or modular monolith, once as microservices or event-driven; explain which you would actually ship. | Build a **multi-agent orchestration demo** with one orchestrator and at least two workers using a deliberate coordination pattern. | Build a **release-management simulator** where workflow objects use behavioral patterns, system boundaries are explicit, and agents collaborate on planning, review, and rollout. |
| **5** | Build a **document or graph explorer** that naturally uses Iterator, Mediator, Memento, Visitor, or Interpreter for traversal, coordination, snapshots, or mini-language support. | Design an **evented business flow** with sync and async boundaries, a read/write split where appropriate, and a clear data ownership story. | Add **guardrails, evals, observability, and human checkpoints** to an existing agent project; produce a short failure report. | Build an **operations desk** or **incident assistant** where services communicate through explicit patterns and agents help investigate, summarize, and route work safely. |
| **6** | Revisit your earlier pattern projects and either consolidate them into one coherent library or rebuild one from scratch with cleaner pattern choices. | Add reliability and cross-cutting behavior: retries, idempotency, caching, tracing, and trade-off analysis for one non-trivial system. | Build a **long-running or stateful agent** with prompt versioning, tool APIs, and a clear autonomy boundary. | Build a **capstone platform** such as a support desk, task queue, or internal ops tool that includes a real software architecture plus one agentic subsystem with clear guardrails. |

### Mastery months (7-12)

| Month | Design Patterns homework | Architecture homework | Agentic Workflows homework | Integrated homework |
| --- | --- | --- | --- | --- |
| **7** | Rebuild 3-5 earlier pattern exercises from memory and write what changed in your design instincts. | Audit a real codebase for concerns, coupling, cohesion, and dependency direction; propose a repair plan. | Take an older agent and reduce prompt ambiguity, improve tool contracts, and tighten memory usage. | Rebuild your Month 1 integrated project with better boundaries and a better agent loop; compare versions honestly. |
| **8** | Write and code **comparison projects** for commonly confused siblings such as Strategy vs State and Decorator vs Proxy. | Redesign one known system using alternate component architectures and defend your final choice. | Turn recurring work into reusable commands, skills, subagents, or hooks and document when each should fire. | Build a **review studio** where architecture analysis, pattern recognition, and agent packaging all support the same workflow. |
| **9** | Build one medium project using 4-6 patterns naturally and justify every one you kept or rejected. | Write a full communication and data design for that same project, including failure-handling choices. | Add agent capabilities only where they outperform deterministic code; document what stayed non-agentic and why. | Deliver a **single product** that includes code patterns, system topology, and agent automation as one coherent design instead of three stitched-on demos. |
| **10** | Implement one rare pattern well enough to teach it, even if you would rarely choose it in production. | Run resilience drills against your system: rate limits, retries, partial outages, stale reads, degraded modes. | Add regression tests, eval suites, traces, approval gates, and escalation paths to the agentic pieces. | Run a **tabletop operations month** for your integrated system: break it, observe it, repair it, and write the postmortem. |
| **11** | Produce teach-back artifacts: diagrams, mini demos, and explanations in your own words. | Write a portfolio-grade architecture document for a medium-sized system. | Write a portfolio-grade operating model for an agentic subsystem, including boundaries and risks. | Build a **showcase repo or portfolio case study** that explains object design, architecture, and agent design in one narrative. |
| **12** | Do a final pattern retention pass by implementing one fresh problem with only the patterns that truly fit. | Do a final architecture retention pass by redrawing the whole system from memory and defending its trade-offs. | Do a final agent retention pass by simplifying one agent until only the necessary mechanisms remain. | Ship a final **end-to-end capstone** and include code, design docs, ops notes, and a retrospective on what you now understand that you did not in Month 1. |

## Homework reflection questions

For every monthly assignment, answer these four questions in writing:

- **Why this pattern or architecture?**
- **What simpler option did I reject?**
- **What failure mode am I designing for?**
- **What part should stay deterministic instead of agentic?**

If you keep answering those questions, the projects will teach judgment instead of just tool familiarity.

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

## Phase 2 — advanced engineer track (Months 13-18, optionally stretched to 24)

After the first three classes, the bottleneck changes. You no longer need only more conceptual coverage; you need stronger execution in messy, real conditions. This phase is about becoming the engineer who can diagnose, stabilize, simplify, harden, and communicate under pressure.

### The six advanced classes

| Month | Advanced class | What it is really training |
| --- | --- | --- |
| **13** | Debugging and Diagnostics | hypothesis loops, repro minimization, root-cause analysis, evidence-driven debugging |
| **14** | Testing and Verification | choosing the right test boundary, contract thinking, integration confidence, flake diagnosis |
| **15** | Performance and Capacity | profiling, latency budgets, bottlenecks, memory discipline, throughput trade-offs |
| **16** | Security and Trust Boundaries | threat modeling, authn/authz, validation, secrets handling, multi-tenant safety |
| **17** | Legacy Rescue and Refactoring | seam creation, strangler moves, safe modernization, dependency untangling |
| **18** | Incident Response and Engineering Execution | observability, runbooks, on-call judgment, postmortems, design docs, ADRs, code review quality |

These six classes are the best next additions if your goal is not just to understand good software, but to perform like a strong engineer in production environments.

The repo materials for this phase live in [software-engineering/advanced-engineering/](software-engineering/advanced-engineering/).

### Advanced monthly homework

| Month | Homework project | Required written output |
| --- | --- | --- |
| **13** | Take a deliberately broken service or toy system, reproduce at least three bugs, isolate root cause for each, and fix the highest-leverage one first. | bug diary, root-cause notes, confidence ranking for each hypothesis |
| **14** | Refactor a small service so it has a deliberate unit/integration/contract test strategy and one intentionally avoided test area with rationale. | testing strategy note and flake-risk analysis |
| **15** | Profile one read-heavy path and one write-heavy path, measure them, improve the slowest path, and show before/after evidence. | performance note with measurements, assumptions, and trade-offs |
| **16** | Perform a lightweight threat model on a small app, then harden authentication, authorization, input handling, and secrets usage. | threat model, risk list, mitigations, and residual risk summary |
| **17** | Take an older or messy codebase and modernize one slice using seams, adapters, or a strangler-style migration path. | modernization plan, dependency map, and rollback considerations |
| **18** | Run an incident simulation on your integrated system: detect, triage, mitigate, communicate, and publish a postmortem with follow-ups. | incident timeline, runbook updates, postmortem, and prevention plan |

### The five-output rule for advanced work

Every advanced project should produce all five of these:

1. **working code or a meaningful system change**
2. **tests or validation evidence**
3. **a short design note**
4. **a runbook or operational checklist**
5. **a retrospective or postmortem**

That five-part package trains a more complete engineering muscle than implementation alone.

### If you want to stretch this phase to 24 months

Use Months 19-24 as a repetition-and-depth block:

- repeat the six advanced classes on larger, uglier, more realistic systems
- revisit the same product with stricter non-functional requirements
- add production-style constraints such as cost ceilings, latency budgets, and degraded-mode behavior
- teach back what you learned through design docs, reviews, and postmortems
- compare your Month 18 work to your Month 1 work and identify where your instincts changed

By that point, the question is no longer "can I build this?" but "can I build, debug, operate, explain, and improve this honestly?"

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
