# What is an agent?

**Category:** Foundations

## The one-sentence definition

An **agent** is an LLM put inside a loop, given **tools** to act on the world, and pointed at a **goal**. It decides its next move at each step, takes the action, observes the result, and decides again — until the goal is reached or it gives up.

## Agent vs chatbot vs workflow

These get conflated. They are not the same.

| Shape | Trigger | Steps | Decisions per run | Example |
|---|---|---|---|---|
| **Chatbot** | User message | 1 (LLM call) | 0 — model just answers | Customer support FAQ bot |
| **Workflow** | Anything | N (predefined) | 0 — pipeline is fixed | Cron job: extract → transform → load |
| **Agent** | Goal | N (variable) | N — model picks each step | Claude Code, Cursor agent mode |

The defining difference is **who decides what to do next**. In a chatbot, the user does. In a workflow, the developer did (at design time). In an agent, the LLM does — at runtime, every step.

## The minimal anatomy

Every agent has at least four pieces:

1. **An LLM** — the decision-maker. Reads context, returns either an action or a final answer.
2. **A tool set** — concrete capabilities (read a file, run a command, query a DB, send an email). Without tools, an agent is just a chatbot.
3. **A loop** — a runtime that asks the LLM "what now?", executes the chosen action, feeds the result back, and asks again.
4. **A goal** (or task) — the user's intent, supplied as a prompt or task definition.

Optional but common:
- **Memory** — persistent state across runs (a notes file, a vector DB, a key-value store).
- **Subagents** — agents that themselves call agents. Fractal.
- **A planner** — a separate step that produces a plan before the loop starts.

## Why agents work (and why they fail)

They work because LLMs are surprisingly good at *picking the next reasonable action* given a clear goal and a small toolbox. A human-written workflow has to anticipate every branch; an agent figures the branch out at runtime.

They fail when:
- The goal is ambiguous and the LLM commits early to the wrong interpretation.
- The tool set is too rich (paralysis) or too sparse (impossibility).
- The loop has no termination condition and runs forever.
- The context window fills with irrelevant history and signal-to-noise crashes.
- The agent hallucinates a tool that doesn't exist, or arguments that don't fit a real one.

These failure modes are not bugs you can patch. They are inherent to the architecture — and managing them is most of what advanced agentic engineering is about. We'll spend Stage 5 on this.

## When to reach for an agent

Use one when **all** of these are true:
- The task can't be reduced to a single LLM call.
- The path to the answer involves real-world interaction (files, APIs, code).
- The branching is data-dependent (you can't pre-write the workflow).
- A non-LLM solution would be a heuristic mess.

Don't reach for one when:
- A deterministic script handles it cleanly. (You're paying tokens for nothing.)
- One LLM call is enough. (No loop = no agent. Just a function call.)
- The cost or latency of a loop is unacceptable for the use case.
- Hallucination would be catastrophic and you can't bound the actions. (Don't give an agent `rm -rf` access.)

## The autonomy gradient

Agents aren't a binary. They live on a spectrum:

| Level | Description | Example |
|---|---|---|
| 0 | LLM produces text. Human acts. | ChatGPT-style copilot |
| 1 | LLM picks tool calls. Human approves each. | Claude Code in default permission mode |
| 2 | LLM acts within a sandbox. Human reviews after. | Claude Code with auto-approved tools |
| 3 | LLM acts in production with guardrails. Human reviews periodically. | A scheduled report-generation agent |
| 4 | LLM acts autonomously. Human reviews aggregates. | Self-healing infra agents (still rare) |

**Rule of thumb:** Start at the lowest level that does the job. Move up only when the cost of a human-in-the-loop is higher than the risk of giving the agent more rope.

## Real-world analogies

- A junior engineer with a task tracker and access to your repo: they pick what to do next, ask for help when stuck, and tell you when they're done. That's an agent. The "tools" are the IDE, git, the database. The "loop" is their workday.
- A self-driving car: sensors (perceive), planner (think), actuators (act), feedback (observe). Same loop, different domain.
- A thermostat is **not** an agent. It's a control loop with no decision space — its "policy" is a fixed function of temperature. An agent has a policy that's *learned* (or in our case, *prompted*) and operates over a rich, open-ended action space.

## Run the demo

```bash
node demo.js
```

The demo implements a minimal agent — 60 lines, no API key required. The "LLM" is a stub that returns canned next-actions; the loop, tool dispatch, and observation flow are real. You can read every line and see exactly where each piece fits.

## What you should walk away with

- The four pieces (LLM + tools + loop + goal) and why each is needed.
- The difference between an agent, a workflow, and a chatbot — phrased so you can correct the next person who confuses them.
- A cautious read on agent hype: agents are a powerful pattern, not a default architecture.
- A vocabulary for the rest of this dojo: when you hear "tool," "loop," "context," "goal," they should mean specific things to you.
