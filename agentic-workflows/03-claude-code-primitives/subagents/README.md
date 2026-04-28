# Subagents

**Category:** Claude Code primitives

## What they are

A **subagent** is a Claude session you spawn from another Claude session, with:

- **Its own context window** (independent from yours).
- **Its own tool allowlist** (you decide what it can do).
- **Its own system prompt** (defining its specialty).
- **A single return value** (its final report comes back as a tool result).

Subagents live in `.claude/agents/<name>.md` (project) or `~/.claude/agents/<name>.md` (user).

The main session is the **orchestrator**. Subagents are the **workers**.

## Why they exist

Three reasons:

### 1. Independent context
The orchestrator doesn't want a 100K-token grep result polluting its context. Spawn a `code-search-agent` to find the thing; get back a 200-token report.

### 2. Independent perspective
A `code-reviewer` agent that hasn't seen your analysis gives you a real second opinion. You can't get the same effect by asking yourself again.

### 3. Parallel speed
Three subagents in parallel finish in roughly one agent's time. A multi-agent code review (security + perf + readability) takes about as long as a single review.

## Anatomy

```markdown
---
name: security-reviewer
description: Reviews code changes for security issues. Use when the user asks
  for security review of a PR, branch, or specific files.
tools: Read, Grep, Glob, Bash
model: sonnet
---

# Security Reviewer

You are a senior security engineer specializing in finding vulnerabilities
in code changes before they merge.

## Your task

When invoked, identify the changed files and review them for:
- Injection attacks (SQL, command, prompt injection)
- Secrets in code (API keys, tokens, passwords)
- Authentication / authorization gaps
- Untrusted input handled without validation
- Cryptographic mistakes (weak ciphers, predictable random)

## Output format

Return a structured report:

{
  "files_reviewed": [string],
  "issues": [{
    "file": string, "line": number,
    "severity": "low" | "med" | "high" | "critical",
    "type": string, "description": string,
    "remediation": string
  }],
  "confidence": "low" | "med" | "high"
}

## Constraints

- Read-only. Do not edit any files.
- Cite file:line for every issue.
- No false positives — be specific.
```

The **frontmatter** controls the agent's runtime config. The **body** is its system prompt.

## When to use a subagent

- The task needs lots of file reading or searching, and you don't want the noise in your main context.
- You want a *fresh* perspective on something you've been thinking about.
- Several subtasks are independent and can run in parallel.
- A step is easier to retry / discard cleanly if isolated.

## When not to

- A single file read or grep — overkill, slower than just doing it.
- The subagent would need most of your context to be useful (then it's not really independent).
- You're tempted to chain many sequential subagents — that's just a workflow; one agent can handle it.

## Spawning agents

In Claude Code, the main session uses the `Agent` tool to spawn subagents. The harness routes based on `subagent_type`:

```
Agent({
  description: "Independent migration review",
  subagent_type: "security-reviewer",
  prompt: "Review migration 0042 for safety. Concerns: locking, ordering, ..."
})
```

The `prompt` is the *user message* the subagent sees. The agent's system prompt comes from its file.

## Briefing a subagent

The main mistake when delegating to subagents: terse, command-style prompts that produce shallow work.

**Bad brief:**
```
Agent({ description: "Review", prompt: "review this PR" })
```

**Good brief:**
```
Agent({
  description: "Independent security review",
  subagent_type: "security-reviewer",
  prompt: `Audit migration 0042_user_schema.sql.

Context: We're adding a NOT NULL column to a 50M-row table. Existing rows
get a backfill default. We've checked locking behavior; we want an
independent verification.

Specifically: is this safe under concurrent writes?
If not, what specifically breaks?
Report under 300 words.`
})
```

The good brief gives the subagent enough context to make judgment calls — not just follow a narrow instruction. The agent didn't see your conversation; you have to summarize what's relevant.

## Anti-patterns

- **The micro-managed subagent.** Telling it exactly which files to read and what to grep — you've reduced it to a script with extra latency.
- **The unbriefed subagent.** Vague task, no context, surprising result.
- **The chain of dependent subagents.** Subagent B uses Subagent A's output. Just write a workflow.
- **The subagent as a hiding place.** Spawning a subagent to "do the part I don't understand" — usually gives you a result you don't understand.

## Trade-offs

**Pros**
- Context isolation; the main session stays focused.
- Independent perspective; useful for review.
- Parallelism for genuinely independent tasks.

**Cons**
- Latency: each spawn is its own LLM call(s).
- Cost: you're running multiple agents, paying for each.
- Coordination overhead: orchestrator has to brief, await, synthesize.
- Quality: a subagent only as good as its system prompt and brief.

**Rule of thumb:** Use subagents for *isolated, parallelizable, or perspective-driven* work. Don't use them for everyday tasks that the main session can do directly.

## Real-world analogies

- A manager hiring contractors for specific deliverables. The manager briefs each, awaits reports, integrates. The contractors don't see the manager's calendar.
- A research team with specialists: the lead asks the chemist, the physicist, and the materials scientist for their views; integrates the answers.

## Run the demo

```bash
cat ./demo/example-agent.md
```

The demo is a complete `.claude/agents/<name>.md` file with frontmatter and a substantive body. You can copy it, install it, and invoke it.

## Deeper intuition

Primitives are the concrete handles the runtime gives you. They matter because production behavior is not shaped by prompts alone; it is shaped by where you package behavior, what gets reused, and which mechanisms stay implicit versus explicit.

The best way to study **Subagents** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
