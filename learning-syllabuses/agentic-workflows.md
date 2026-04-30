# Agentic workflows — master syllabus (beginner → expert)

Source of truth for the `daily-tasks` skill. Walks you from "I've heard of agents" to "I can design, defend, and ship a production agentic system." Mirrors `agentic-workflows/SYLLABUS.md` for repo-anchored topics, then adds an expert tier that goes beyond the repo.

For each topic the canonical step order is **read → demo → implement**. The "implement" step uses the topic's `homework.md` and writes to `agentic-workflows/_solutions/<section>/<topic>/`. Topics in the expert tier may not have a homework file — those are clearly marked and use the listed deliverable instead.

The skill picks the next topic by `(level, index)` in `state.md`. When a topic's `implement` step is done, advance the index by 1; when the index passes the end of a level, advance the level.

---

## Level 1 — Beginner: Foundations

The vocabulary. Without it, every later topic is jargon. Goal: read someone else's agent code and identify the loop, tools, prompt structure, and context strategy.

| # | Topic | Path |
|---|---|---|
| 1 | what-is-an-agent | `agentic-workflows/01-foundations/what-is-an-agent/` |
| 2 | the-agentic-loop | `agentic-workflows/01-foundations/the-agentic-loop/` |
| 3 | tools-as-the-world-interface | `agentic-workflows/01-foundations/tools-as-the-world-interface/` |
| 4 | context-as-working-memory | `agentic-workflows/01-foundations/context-as-working-memory/` |
| 5 | prompts-as-programs | `agentic-workflows/01-foundations/prompts-as-programs/` |

**Level capstone:** read one production agent codebase (suggested: a real `.claude/` config or open-source agent project) and write a 1-page reading note identifying its loop, tools, prompt structure, and memory strategy.

---

## Level 2 — Intermediate: Single-agent design + Claude Code primitives

How to make ONE agent reliable, then how to use the actual primitives in this CLI. Goal: design a robust single-agent system AND have shipped at least one custom slash command, agent, hook, and tuned permissions config.

| # | Topic | Path |
|---|---|---|
| 1 | system-prompt-anatomy | `agentic-workflows/02-single-agent-design/system-prompt-anatomy/` |
| 2 | tool-design-principles | `agentic-workflows/02-single-agent-design/tool-design-principles/` |
| 3 | tool-result-handling | `agentic-workflows/02-single-agent-design/tool-result-handling/` |
| 4 | memory-patterns | `agentic-workflows/02-single-agent-design/memory-patterns/` |
| 5 | structured-output | `agentic-workflows/02-single-agent-design/structured-output/` |
| 6 | error-handling-and-recovery | `agentic-workflows/02-single-agent-design/error-handling-and-recovery/` |
| 7 | plans-and-tasks | `agentic-workflows/02-single-agent-design/plans-and-tasks/` |
| 8 | slash-commands | `agentic-workflows/03-claude-code-primitives/slash-commands/` |
| 9 | skills | `agentic-workflows/03-claude-code-primitives/skills/` |
| 10 | subagents | `agentic-workflows/03-claude-code-primitives/subagents/` |
| 11 | hooks | `agentic-workflows/03-claude-code-primitives/hooks/` |
| 12 | settings-and-permissions | `agentic-workflows/03-claude-code-primitives/settings-and-permissions/` |
| 13 | mcp-servers | `agentic-workflows/03-claude-code-primitives/mcp-servers/` |

**Level capstone:** ship a useful single-agent setup in this repo — at minimum one custom slash command, one custom agent, one hook, a tuned `settings.json`. Write a short design doc justifying each choice.

---

## Level 3 — Advanced: Multi-agent + reliability/ops

Coordinating multiple agents and making them trustworthy in production. Goal: pick the right multi-agent pattern for a given problem and ship an agent that runs unattended with evals, traces, guardrails, and cost controls.

| # | Topic | Path |
|---|---|---|
| 1 | orchestrator-worker | `agentic-workflows/04-multi-agent-patterns/orchestrator-worker/` |
| 2 | sequential-pipeline | `agentic-workflows/04-multi-agent-patterns/sequential-pipeline/` |
| 3 | parallel-fan-out-fan-in | `agentic-workflows/04-multi-agent-patterns/parallel-fan-out-fan-in/` |
| 4 | critic-reviewer | `agentic-workflows/04-multi-agent-patterns/critic-reviewer/` |
| 5 | hierarchical | `agentic-workflows/04-multi-agent-patterns/hierarchical/` |
| 6 | hand-off-vs-delegation | `agentic-workflows/04-multi-agent-patterns/hand-off-vs-delegation/` |
| 7 | evals-for-agents | `agentic-workflows/05-reliability-and-ops/evals-for-agents/` |
| 8 | observability-and-tracing | `agentic-workflows/05-reliability-and-ops/observability-and-tracing/` |
| 9 | cost-and-latency-control | `agentic-workflows/05-reliability-and-ops/cost-and-latency-control/` |
| 10 | failure-modes | `agentic-workflows/05-reliability-and-ops/failure-modes/` |
| 11 | guardrails | `agentic-workflows/05-reliability-and-ops/guardrails/` |
| 12 | human-in-the-loop | `agentic-workflows/05-reliability-and-ops/human-in-the-loop/` |

**Level capstone:** build a multi-agent system using two of the patterns above. Add an eval suite, a trace dashboard or log-grep pipeline, a budget cap, and at least one guardrail. Write a 2-page failure-mode analysis.

---

## Level 4 — Expert: Building for real + capstone (extends beyond repo)

Production agentic engineering and original design. Goal: design an agent end-to-end, defend every choice, and operate it as a product.

| # | Topic | Path / source |
|---|---|---|
| 1 | tool-api-design | `agentic-workflows/06-building-for-real/tool-api-design/` |
| 2 | prompt-versioning-and-regression-tests | `agentic-workflows/06-building-for-real/prompt-versioning-and-regression-tests/` |
| 3 | long-running-agents | `agentic-workflows/06-building-for-real/long-running-agents/` |
| 4 | autonomy-gradient | `agentic-workflows/06-building-for-real/autonomy-gradient/` |
| 5 | repo capstone — design and build an original agent | `agentic-workflows/06-building-for-real/` (use Stage-6 capstone brief) |
| 6 | study one production-agent codebase end-to-end | external (no repo file) — pick from your work or open source. Deliverable: 3-page reading note covering loop, tools, prompts, memory, evals, ops. |
| 7 | read *Building Effective Agents* + ReAct paper, write 1-page synthesis | external. Deliverable: synthesis doc in `_solutions/external/` |
| 8 | original capstone — ship a non-trivial agent to real users | external. Deliverable: design doc + working code + 1-month retrospective |

For external topics: there is no `README.md`/`demo.js`/`homework.md` — use the deliverable as the "implement" step and skip read/demo if not applicable. The skill should treat the deliverable as a single multi-day implement step.

---

## Reading alongside

Pick one or two; don't try to read all:
- *Building Effective Agents* (Anthropic, 2024)
- ReAct paper (Yao et al., 2022)
- Anthropic docs on tool use, prompt caching, agents
- This repo's `READING-LIBRARY.md` for the larger bookshelf
