# Multi-agent orchestration

Multi-agent orchestration means coordinating **several subagents** to work on one project together — typically by having a main "orchestrator" session fan work out to specialist agents and then synthesize their results.

Claude Code has no dedicated `panels/` or `squads/` primitive for this. Orchestration is assembled from pieces you already have: **a slash command (or prompt) that instructs the main Claude to spawn multiple `Agent` calls and reconcile their output.**

> If you're asking about the "Claude panel" in VS Code, that's the editor UI — see [panels.md](panels.md). This doc is about orchestrating agents, which is what most people actually want when they say "panel of agents."

## When orchestration is the right tool

Reach for it when:

- The work splits cleanly into **independent** subtasks (the agents don't need each other's output)
- You want **diverse perspectives** on one artifact (security + perf + UX review of the same PR)
- A single agent would either run out of context or produce shallow results trying to do it all
- You need **parallel speed** — three agents in parallel beats one agent doing three rounds sequentially

Don't orchestrate when the subtasks are genuinely sequential (step 2 needs step 1's output). That's just a workflow — one agent can handle it, or a slash command with ordered steps.

## The pattern

Every multi-agent workflow has three parts:

1. **The orchestrator prompt** — the slash command or message that kicks things off
2. **The specialist agents** — two or more subagents, each with a focused role
3. **The synthesis step** — the orchestrator reads the agents' reports and produces a combined answer

Implementation: write a slash command whose body tells the main Claude to spawn N `Agent` calls in parallel and synthesize. The parallelism is free — multiple `Agent` tool calls in a **single message** run concurrently.

## A concrete example: `/review-crew`

Goal: review the current branch from three angles (security, performance, readability) and produce a consolidated report.

### Step 1 — create the specialist agents

`.claude/agents/security-reviewer.md`:

```markdown
---
name: security-reviewer
description: Reviews code changes for security issues. Used by the review crew.
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
description: Reviews code changes for performance issues. Used by the review crew.
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
description: Reviews code changes for clarity and maintainability. Used by the review crew.
tools: Read, Grep, Glob
---
Review for: unclear names, tangled control flow, missing invariants,
inappropriate abstractions, and comments that explain what instead of why.
Prioritize findings and cite path:line. Be specific — "rename X to Y" not "improve naming".
```

### Step 2 — create the orchestrator command

`.claude/commands/review-crew.md`:

```markdown
---
description: Run a multi-agent review crew on the current branch
---

Review the current branch using three reviewer agents in parallel.

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

Type `/review-crew` in Claude Code. The main Claude reads the command, fans out to all three agents in parallel, collects their reports, and produces the synthesized output.

## Orchestration shapes worth stealing

| Shape | Agents | Use for |
| --- | --- | --- |
| **Review crew** | security / perf / readability | PR reviews, pre-merge checks |
| **Planning crew** | explorer / architect / risk-analyst | Large features where you want diverse proposals |
| **Research crew** | N domain-focused explorers | "Where does X happen in this codebase?" across many areas |
| **Variant crew** | N implementers with different constraints | "Draft three approaches to this API" |
| **Red team crew** | attacker / defender / auditor | Security reviews, threat modeling |

## Design principles

- **Give each agent one job.** A "security and perf reviewer" is worse than two specialists — the model will split attention.
- **Parallelize aggressively.** Anything that doesn't depend on another agent's output should run concurrently.
- **Make the synthesis step explicit.** Say "deduplicate," "prioritize," "reconcile conflicts." Otherwise you'll get three reports stapled together.
- **Keep agent tools minimal.** A reviewer usually needs `Read, Grep, Glob` — not `Edit` or `Bash`.
- **Write the orchestrator as a recipe, not a vibe.** Enumerate the agents, the inputs they get, and the output format of the synthesis. The more specific the command, the more reproducible the result.

## Anti-patterns

- **The "do everything" crew.** 8 agents, overlapping responsibilities — you get noise.
- **Sequential crew.** If A → B → C with hard dependencies, one agent is usually better.
- **Missing synthesis.** Three reports dumped verbatim is not an orchestrated output. Always reconcile.
- **Stateful assumptions.** Agents don't share memory. Don't design a crew that assumes they do.

## When to reach for `/batch` instead

The built-in `/batch` skill (see [built-in-commands.md](built-in-commands.md)) also orchestrates many agents — but it's optimized for **large-scale parallel edits** across a codebase, running 5–30 agents in isolated git worktrees. Use `/batch` when you want to *change* many files; use a hand-built crew when you want multiple perspectives on the *same* artifact.

## Where to go next

- How subagents work under the hood → [agents.md](agents.md)
- How to make the orchestrator command itself → [slash-commands.md](slash-commands.md)
- Using plan mode to design an orchestration before running it → [plans.md](plans.md)
- The actual VS Code "panel" UI → [panels.md](panels.md)
