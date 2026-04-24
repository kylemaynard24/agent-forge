# Panels (multi-agent orchestration)

> **Terminology note.** "Panel" is *your* term for this repo. It isn't a built-in Claude Code concept — there's no `.claude/panels/` folder. A panel is a **plan that coordinates multiple agents over a project**, implemented as a slash command (or plain prompt) that fans work out to several subagents and then synthesizes their results.

Think of it like assembling a panel of experts: you give them the same question, they each weigh in from their angle, and the orchestrator (the main Claude) reconciles the findings.

## When a panel is the right tool

Reach for a panel when:

- The work splits cleanly into **independent** subtasks (they don't read each other's output)
- You want **diverse perspectives** on one artifact (security + perf + UX review of the same PR)
- A single agent would either run out of context or produce shallow results trying to do it all
- You need **parallel speed** — three agents in parallel beats one agent doing three rounds sequentially

Don't use a panel when the subtasks are genuinely sequential (step 2 needs step 1's output). That's just a workflow — one agent can do it, or a slash command with ordered steps.

## The panel pattern

A panel has three parts:

1. **The orchestrator prompt** — the slash command or prompt that kicks things off
2. **The specialist agents** — two or more subagents, each with a focused role
3. **The synthesis step** — the orchestrator reads the agents' reports and produces a combined answer

In Claude Code, you implement a panel by writing a slash command whose body tells the main Claude to spawn N `Agent` calls in parallel and synthesize. The parallelism is free — multiple `Agent` tool calls in a single message run concurrently.

## A concrete example: `/review-panel`

Goal: review the current branch from three angles (security, performance, readability) and produce a consolidated report.

### Step 1 — create the specialist agents

`.claude/agents/security-reviewer.md`:

```markdown
---
name: security-reviewer
description: Reviews code changes for security issues. Used by review panels.
tools: Read, Grep, Glob, Bash
---
Review the named diff/files for: injection risks, unsafe deserialization,
auth/authz gaps, secret exposure, and OWASP top-10 issues. Report as
prioritized findings (CRITICAL / HIGH / MEDIUM / NIT). Cite path:line.
```

`.claude/agents/perf-reviewer.md`:

```markdown
---
name: perf-reviewer
description: Reviews code changes for performance issues. Used by review panels.
tools: Read, Grep, Glob, Bash
---
Review for: N+1 queries, unindexed lookups, hot-path allocations,
blocking I/O on async paths, and obvious algorithmic issues. Prioritize
findings and cite path:line. Flag when perf work would be premature.
```

`.claude/agents/readability-reviewer.md`:

```markdown
---
name: readability-reviewer
description: Reviews code changes for clarity and maintainability. Used by review panels.
tools: Read, Grep, Glob
---
Review for: unclear names, tangled control flow, missing invariants,
inappropriate abstractions, and comments that explain what instead of why.
Prioritize findings and cite path:line. Be specific — "rename X to Y" not "improve naming".
```

### Step 2 — create the panel command

`.claude/commands/review-panel.md`:

```markdown
---
description: Run a multi-agent review panel on the current branch
---

Review the current branch using a three-agent panel.

1. Identify the changed files (`git diff main...HEAD --name-only`).
2. **In a single message, spawn three agents in parallel:**
   - `security-reviewer` on the changed files
   - `perf-reviewer` on the changed files
   - `readability-reviewer` on the changed files

   Give each the same file list and ask for a prioritized report.
3. When all three return, synthesize into one consolidated report:
   - **Blockers** (anything CRITICAL/HIGH from any reviewer)
   - **Recommended fixes** (MEDIUM)
   - **Nits** (low priority)
   Deduplicate overlapping findings and cite the reviewer(s) who raised each.
4. End with a one-line verdict: ship / fix-then-ship / rework.
```

### Step 3 — run it

Type `/review-panel` in Claude Code. The main Claude reads the command, fans out to all three agents in parallel, collects their reports, and produces the synthesized output.

## Design principles for panels

- **Give each agent one job.** A "security and perf reviewer" is worse than two specialists — the model will split attention.
- **Parallelize aggressively.** Anything that doesn't depend on another agent's output should run concurrently.
- **Make the synthesis step explicit.** Say "deduplicate," "prioritize," "reconcile conflicts." Otherwise you'll get three reports stapled together.
- **Keep agent tools minimal.** A reviewer usually needs `Read, Grep, Glob` — not `Edit` or `Bash`.
- **Write the panel command as a recipe, not a vibe.** Enumerate the agents, the inputs they get, and the output format of the synthesis. The more specific the command, the more reproducible the panel.

## Panel shapes worth stealing

| Shape | Agents | Use for |
| --- | --- | --- |
| **Review panel** | security / perf / readability | PR reviews, pre-merge checks |
| **Planning panel** | explorer / architect / risk-analyst | Large features where you want diverse proposals |
| **Research panel** | N domain-focused explorers | "Where does X happen in this codebase?" across many areas |
| **Variant panel** | N implementers with different constraints | "Draft three approaches to this API" |
| **Red team panel** | attacker / defender / auditor | Security reviews, threat modeling |

## Anti-patterns

- **The "do everything" panel.** 8 agents, overlapping responsibilities — you get noise.
- **Sequential panels.** If A → B → C with hard dependencies, one agent is usually better.
- **Missing synthesis.** Three reports dumped verbatim is not a panel output. Always reconcile.
- **Stateful agents.** Agents don't share memory. Don't design a panel that assumes they do.

## Where to go next

- How subagents work under the hood → [agents.md](agents.md)
- How to make the panel command itself → [slash-commands.md](slash-commands.md)
- Using plan mode to design a panel before running it → [plans.md](plans.md)
