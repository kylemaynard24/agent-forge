# Agentic Workflows — A 6-Month Syllabus

A self-directed path from "I've heard of agents" to "I can design, build, and ship an agentic system that doesn't embarrass me." Six stages, six months, ~32 topics. Every topic has three artifacts:

1. **README.md** — substantive concept material (60–150 lines), with trade-offs, anti-patterns, and rules of thumb.
2. **demo.js** (or demo file) — runnable code or example artifact you can copy and adapt.
3. **homework.md** — exercises with constraints designed to make you actually apply the concept.

The constraints in each homework are the point. They're designed so you *can't* shortcut around the concept. Resist the urge to bend them.

---

## How to work through this

For each topic, in order:

1. **Read the README** carefully (15-30 minutes for the longer ones). The "trade-offs," "anti-patterns," and "rule of thumb" sections are the load-bearing parts — they tell you when *not* to use the pattern, which is more useful than when to use it.
2. **Run / read the demo.** Modify it. Break it. Predict the output before re-running.
3. **Do the homework** (1-4 hours per topic). Write your code in a scratch folder (suggested: `agentic-workflows/_solutions/<section>/<topic>/`, gitignored). Hit every "Done when" checkbox.
4. **Write a one-paragraph retrospective.** What surprised you? What was harder than expected? Save these — they're invaluable when you revisit a topic.

**Cadence.** Most topics fit in one week of part-time study (~5-8 hours). Capstone topics need more. The schedule below assumes ~7 hours/week.

**Don't skip ahead.** Sections build on each other. Section 02 uses concepts from section 01. Section 04 assumes section 02. Section 06 capstone integrates everything.

---

## The path

### Month 1 — Foundations (Stage 1)

The vocabulary. Without it, every later topic is jargon.

| Week | Topic | Why it's first |
|------|-------|----------------|
| 1 | what-is-an-agent | The four pieces (LLM + tools + loop + goal). Vocabulary anchor. |
| 2 | the-agentic-loop | The four-phase loop. ReAct. Termination. |
| 3 | tools-as-the-world-interface | Tools are the agent's interface. Bad tools = dumb agents. |
| 4 | context-as-working-memory + prompts-as-programs | The two highest-leverage knobs in the agent system. |

**End of month:** You should be able to read someone else's agent code and identify the loop, tools, prompt structure, and context strategy.

---

### Month 2 — Single-Agent Design (Stage 2)

How to make ONE agent reliable.

| Week | Topic |
|------|-------|
| 1 | system-prompt-anatomy + tool-design-principles |
| 2 | tool-result-handling + memory-patterns |
| 3 | structured-output |
| 4 | error-handling-and-recovery + plans-and-tasks |

**End of month:** You can design and build a robust single-agent system that handles failures, persists memory, and emits structured output.

---

### Month 3 — Claude Code Primitives (Stage 3)

The actual tools in this repo. This month is concrete: you'll write real `.claude/*` files and use them.

| Week | Topic |
|------|-------|
| 1 | slash-commands + skills |
| 2 | subagents |
| 3 | hooks + settings-and-permissions |
| 4 | mcp-servers |

**End of month:** You have at least one custom slash command, one custom agent, one hook, and a tuned permissions config in production use.

---

### Month 4 — Multi-Agent Patterns (Stage 4)

Coordinating multiple agents.

| Week | Topic |
|------|-------|
| 1 | orchestrator-worker + sequential-pipeline |
| 2 | parallel-fan-out-fan-in |
| 3 | critic-reviewer |
| 4 | hierarchical + hand-off-vs-delegation |

**End of month:** You can pick the right multi-agent pattern for a given problem and articulate the trade-offs.

---

### Month 5 — Reliability and Ops (Stage 5)

Making agents that don't embarrass you in production.

| Week | Topic |
|------|-------|
| 1 | evals-for-agents |
| 2 | observability-and-tracing |
| 3 | cost-and-latency-control + failure-modes |
| 4 | guardrails + human-in-the-loop |

**End of month:** You can ship an agent that runs unattended and trust it. You have evals, traces, guardrails, and cost controls.

---

### Month 6 — Building For Real + Capstone (Stage 6)

| Week | Topic |
|------|-------|
| 1 | tool-api-design + prompt-versioning-and-regression-tests |
| 2 | long-running-agents |
| 3 | autonomy-gradient |
| 4 | **Capstone** — design an agent (and build it) |

**End of month / end of course:** You've designed and built an agent end-to-end. You can defend every design choice. You're an agentic engineer.

---

## How this course relates to the others in this repo

This `agentic-workflows/` track sits alongside two others:

- `software-engineering/design-patterns/` — GoF design patterns (single-process patterns).
- `software-engineering/architecture/` — software architecture from fundamentals to distributed systems.

The three together cover: how to write good code (patterns), how to organize a system (architecture), and how to build an agentic system (this track). They reinforce each other; you'll find SRP and dependency inversion appearing in agent design, and observability appearing in both.

If you're new to all three: start with **`software-engineering/SYLLABUS.md`** for foundations, then come back here for agentic depth.

If you're already a strong engineer: start here.

---

## Recommended reading alongside

- *Building Effective Agents* (Anthropic, 2024) — short paper, foundational.
- *The Agent Is The Product* (essays / blog posts on production agent engineering).
- Anthropic's docs on tool use, prompt caching, and agents.
- ReAct paper (Yao et al., 2022) — the foundational loop.
- Selected blog posts on multi-agent failure modes.

You don't need to read all of these. Pick one or two and pair with your study.

For the larger repo-wide bookshelf, see [`../READING-LIBRARY.md`](../READING-LIBRARY.md). That guide maps books to the engineering and agentic subjects across the entire repository.

---

## Working notes

- **Don't aim for perfect agents.** Aim for agents you can *defend*. Working knowledge of the trade-offs beats sophistication on every dimension.
- **Use stub LLMs liberally.** The demos here use stubs so you can focus on architecture. When you need real LLM calls, you can swap in the API.
- **The homework constraints are the point.** Bypass them and you've learned nothing.
- **Treat your agent like a product, not a demo.** Every shipped agent has a user. Design for them.
- **Skip topics that don't apply to your work.** If you're not building MCP servers, the MCP topic is reference reading, not homework.
- **Teach what you learn.** Give a brown-bag, write a blog post, mentor a teammate. Teaching exposes the holes.

---

## Folder map

```
agentic-workflows/
├── SYLLABUS.md          ← this file
├── 01-foundations/
│   ├── what-is-an-agent/
│   ├── the-agentic-loop/
│   ├── tools-as-the-world-interface/
│   ├── context-as-working-memory/
│   └── prompts-as-programs/
├── 02-single-agent-design/
│   ├── system-prompt-anatomy/
│   ├── tool-design-principles/
│   ├── tool-result-handling/
│   ├── memory-patterns/
│   ├── structured-output/
│   ├── error-handling-and-recovery/
│   └── plans-and-tasks/
├── 03-claude-code-primitives/
│   ├── slash-commands/
│   ├── skills/
│   ├── subagents/
│   ├── hooks/
│   ├── mcp-servers/
│   └── settings-and-permissions/
├── 04-multi-agent-patterns/
│   ├── orchestrator-worker/
│   ├── sequential-pipeline/
│   ├── parallel-fan-out-fan-in/
│   ├── critic-reviewer/
│   ├── hierarchical/
│   └── hand-off-vs-delegation/
├── 05-reliability-and-ops/
│   ├── evals-for-agents/
│   ├── observability-and-tracing/
│   ├── cost-and-latency-control/
│   ├── failure-modes/
│   ├── guardrails/
│   └── human-in-the-loop/
└── 06-building-for-real/
    ├── tool-api-design/
    ├── prompt-versioning-and-regression-tests/
    ├── long-running-agents/
    ├── autonomy-gradient/
    └── capstone-design-an-agent/
```

Six months. Thirty-two topics. ~100 files. You design and build an agent at the end.

The curriculum is the structure. The work is yours. Begin.
