# agent-forge

`agent-forge` is a learning repository for people who want to grow from **beginner programmer** to **systems-minded engineer** to **agent-builder with real operational judgment**.

It is not just a notes repo. It is a structured curriculum made of:

- **README.md** files that explain concepts in plain language
- **demo.js** files that make the idea concrete and runnable
- **homework.md** files that force application instead of passive reading
- **project.md** files in many sections that push you into larger, more realistic work
- project-scoped **`.claude/`** artifacts that demonstrate agents, commands, skills, and orchestration in practice

At the top level, this repository has five major directories and one major syllabus file:

| Path | What it contains | Why it matters |
| --- | --- | --- |
| [`software-engineering/`](software-engineering/) | Beginner JavaScript, design patterns, architecture, and advanced engineering material | This is the broad engineering curriculum |
| [`agentic-workflows/`](agentic-workflows/) | A staged curriculum for understanding and building LLM-driven agents | This is the agent design and operations curriculum |
| [`docs/`](docs/) | Reference-style documentation for Claude Code concepts and terminology | This is the conceptual reference shelf |
| [`examples/`](examples/) | Working Claude Code examples and templates | This is the runnable lab for repo-scoped agent tooling |
| [`.claude/`](.claude/) | Project-scoped agents, commands, and skills used by the examples | This is the repo's live Claude Code configuration surface |
| [`SYLLABUS.md`](SYLLABUS.md) | The root learning plan across the repository | This is the "how to study this repo" document |

## What this repository is trying to teach

The repo teaches across several different scales:

1. **Programming fundamentals** — variables, control flow, functions, objects, and beginner OOP
2. **Object and module design** — design patterns and core software design principles
3. **System design** — architecture, communication, data, resilience, and trade-offs
4. **Agent design** — prompts, tools, memory, orchestration, reliability, and guardrails
5. **Advanced engineering execution** — debugging, testing, performance, security, legacy rescue, and incident response

The important part is that these scales connect. A strong engineer can move from a small local design choice to a system boundary to an operational consequence without getting lost.

## How the repo is organized

### 1. `software-engineering/`

This is the largest conventional engineering section of the repo. It covers four different layers of growth:

| Subsection | What it teaches |
| --- | --- |
| [`super-beginner-javascript/`](software-engineering/super-beginner-javascript/) | A true beginner path for teaching JavaScript from zero: values, variables, conditionals, loops, arrays, objects, functions, debugging basics, and beginner OOP |
| [`design-patterns/`](software-engineering/design-patterns/) | The GoF patterns, organized as a study path with runnable demos and comparisons between similar patterns |
| [`architecture/`](software-engineering/architecture/) | Software architecture topics such as principles, component boundaries, system architecture, communication, data, resilience, and cross-cutting trade-offs |
| [`advanced-engineering/`](software-engineering/advanced-engineering/) | Post-core engineering skills: debugging, testing, performance, security, legacy modernization, and incident execution |

#### `software-engineering/super-beginner-javascript/`

This section exists for learners who are **absolutely green** and for people who want to teach friends from the ground up. It starts with simple syntax and simple mental models instead of assuming prior experience.

Each topic folder contains:

- a beginner-friendly **README**
- a small runnable **demo**
- a **homework** prompt
- a **project** brief

The sequence is intentionally gentle:

1. values and variables
2. strings, numbers, and booleans
3. conditionals
4. arrays
5. objects
6. loops
7. functions
8. scope and state
9. arrays and objects together
10. debugging basics
11. classes and OOP
12. mini capstone

#### `software-engineering/design-patterns/`

This section teaches reusable object-level design vocabulary. The patterns are grouped into:

- **creational**
- **structural**
- **behavioral**

It is designed as a study path, not just a catalog. The point is not to memorize UML shapes. The point is to learn what problem pressure each pattern responds to and how to distinguish close siblings like:

- Strategy vs State
- Adapter vs Facade
- Decorator vs Proxy
- Command vs Memento
- Observer vs Mediator

#### `software-engineering/architecture/`

This section teaches system-level thinking. It moves from local principles to large-scale trade-offs:

- `01-fundamentals/` — separation of concerns, coupling/cohesion, abstraction, dependency direction, DRY/KISS/YAGNI
- `02-principles/` — SOLID and Law of Demeter
- `03-component-architecture/` — layered, hexagonal, clean/onion, MVC/MVP/MVVM, DDD building blocks
- `04-system-architecture/` — monolith, modular monolith, microservices, event-driven, pipes and filters, topology choices
- `05-communication/` — sync/async communication, CQRS, saga, event sourcing, gateways, BFF
- `06-data/` — caching, database-per-service, shared database, sharding, replicas, CDC and outbox
- `07-resilience-and-scale/` — retries, timeouts, bulkheads, load balancing, idempotency, rate limiting, circuit breakers
- `08-cross-cutting/` — observability, CAP/PACELC, distributed systems fallacies, trade-off analysis

#### `software-engineering/advanced-engineering/`

This section exists for the skills that usually separate a merely knowledgeable engineer from a reliable one in production settings.

The six main advanced areas are:

1. debugging and diagnostics
2. testing and verification
3. performance and capacity
4. security and trust boundaries
5. legacy rescue and refactoring
6. incident response and engineering execution

Each advanced area now contains:

- an area **README**
- an area-level **demo**
- an area-level **homework**
- an area-level **project**
- a deeper ladder of **subtopics**, each with its own `README.md`, `demo.js`, and `homework.md`

That means this part of the repo works like a mini-curriculum inside the larger curriculum.

### 2. `agentic-workflows/`

This section is the staged curriculum for understanding how modern coding agents and LLM systems are built.

It is organized into six stages:

| Stage | What it covers |
| --- | --- |
| [`01-foundations/`](agentic-workflows/01-foundations/) | What an agent is, the agentic loop, prompts as programs, context, and tools |
| [`02-single-agent-design/`](agentic-workflows/02-single-agent-design/) | Prompt anatomy, structured outputs, planning, memory, tool design, and recovery behavior |
| [`03-claude-code-primitives/`](agentic-workflows/03-claude-code-primitives/) | Claude Code features such as subagents, slash commands, skills, hooks, MCP servers, and settings |
| [`04-multi-agent-patterns/`](agentic-workflows/04-multi-agent-patterns/) | Orchestrator-worker, sequential pipelines, parallel fan-out, hand-off vs delegation, critic-reviewer, hierarchical patterns |
| [`05-reliability-and-ops/`](agentic-workflows/05-reliability-and-ops/) | Guardrails, evals, failure modes, observability, cost/latency control, human-in-the-loop |
| [`06-building-for-real/`](agentic-workflows/06-building-for-real/) | Tool API design, long-running agents, prompt versioning, autonomy gradient, capstone design |

Like the engineering sections, many topics include runnable demos and homework so you can move from concept to implementation.

### 3. `docs/`

`docs/` is the reference shelf for Claude Code concepts. It explains the runtime concepts that the examples and agentic workflows rely on.

Key documents include:

- `getting-started.md`
- `built-in-commands.md`
- `agents.md`
- `plans.md`
- `multi-agent.md`
- `panels.md`
- `slash-commands.md`
- `skills.md`
- `hooks.md`

If a concept in `examples/` or `agentic-workflows/` feels fuzzy, `docs/` is where you tighten the definition.

### 4. `examples/`

`examples/` is the practical lab for Claude Code primitives. It shows what project-scoped agent tooling looks like when it is actually wired into a repo.

It includes examples for:

- **agents**
- **slash commands**
- **skills**
- **hooks**
- orchestration walkthroughs
- plan prompts and annotated plans

This section is especially useful if you want to copy patterns into your own repos rather than just understand them conceptually.

### 5. `.claude/`

This is the repo's project-scoped Claude Code configuration. It is the live configuration surface that makes the examples immediately usable when Claude Code runs from this repository root.

It currently includes:

- `.claude/agents/`
  - `explainer.md`
  - `perf-reviewer.md`
  - `readability-reviewer.md`
  - `security-reviewer.md`
- `.claude/commands/`
  - `hello.md`
  - `explain.md`
  - `pr-desc.md`
  - `review-crew.md`
- `.claude/skills/`
  - `test-first/SKILL.md`

If you launch Claude Code in this repo, these are the project-scoped helpers that become available.

## How the material is meant to be used

Most topics in this repository follow the same learning loop:

1. read the **README**
2. run the **demo**
3. modify the demo and predict the outcome
4. do the **homework**
5. attempt the **project** if one exists
6. write down the trade-off you learned

That last step matters. This repo is trying to teach judgment, not just syntax.

## How to study this repo depending on your starting point

### If you are brand new to coding

Start here:

1. [`software-engineering/super-beginner-javascript/`](software-engineering/super-beginner-javascript/)
2. then move into [`software-engineering/design-patterns/`](software-engineering/design-patterns/)
3. then start the architecture material

### If you already write code but want stronger engineering fundamentals

Start here:

1. [`software-engineering/README.md`](software-engineering/README.md)
2. [`software-engineering/design-patterns/README.md`](software-engineering/design-patterns/README.md)
3. [`software-engineering/SYLLABUS.md`](software-engineering/SYLLABUS.md)

### If you want to learn agent design and Claude Code concepts

Start here:

1. [`agentic-workflows/01-foundations/what-is-an-agent/`](agentic-workflows/01-foundations/what-is-an-agent/)
2. [`docs/README.md`](docs/README.md)
3. [`examples/README.md`](examples/README.md)

### If you want the "top 5% engineer" stretch

Finish the core tracks, then go into:

1. [`software-engineering/advanced-engineering/`](software-engineering/advanced-engineering/)
2. the advanced phase in [`SYLLABUS.md`](SYLLABUS.md)

## Syllabus files

There are two major syllabus entry points:

- [`SYLLABUS.md`](SYLLABUS.md) — the repository-wide learning plan
- [`software-engineering/SYLLABUS.md`](software-engineering/SYLLABUS.md) — the deeper engineering dojo syllabus

Use the root syllabus for the broad roadmap. Use the software-engineering syllabus for the more detailed engineering sequence.

## Running the demos

Most demos in the repo are plain Node.js scripts:

```bash
node path/to/demo.js
```

They are intentionally small, local, and dependency-light so you can focus on the concept instead of setup.

## What "understanding this repo" should feel like

By the time this repository starts to feel natural, you should be able to move comfortably between:

- basic programming ideas
- class and module design
- system architecture
- operational trade-offs
- agent behavior and tool use
- debugging, safety, and production judgment

That range is the point of `agent-forge`. It is trying to help you build not just code, but engineering taste.
