# agent-forge

`agent-forge` is a learning repo for two related subjects:

1. **How good software gets designed** — principles, architecture, and classic design patterns.
2. **How capable LLM agents get built** — prompts, tools, memory, orchestration, and production guardrails.

The repository is organized so you can move from concept -> runnable example -> practice loop instead of collecting disconnected notes. Most folders are intentionally small and self-contained so you can study one idea at a time without losing the larger map.

## The three learning tracks

Treat the repo like three parallel classes:

| Track | What it teaches you to notice | Where to start |
| --- | --- | --- |
| **Design patterns** | Reusable object-level solutions and the trade-offs behind them | [software-engineering/design-patterns/](software-engineering/design-patterns/) |
| **Architecture** | System boundaries, communication, data, scale, and failure | [software-engineering/](software-engineering/) and [software-engineering/SYLLABUS.md](software-engineering/SYLLABUS.md) |
| **Agentic workflows** | How LLM agents are structured, controlled, and operated | [agentic-workflows/01-foundations/](agentic-workflows/01-foundations/) |

If you want a semester-style plan across all three, use [SYLLABUS.md](SYLLABUS.md). It lays out a 6-month core path with an optional extension to 12 months.

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
