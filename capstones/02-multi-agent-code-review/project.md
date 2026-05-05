# Capstone 02 — Multi-Agent Code Review System

## Context

Code review is one of the highest-leverage activities in software engineering. A good review catches bugs, improves design, transfers knowledge, and raises the team's quality bar. A bad review is a rubber stamp. Most reviews fall somewhere in between — thorough in the reviewer's area of expertise, spotty everywhere else.

An automated code review system does not replace human judgment on the things that matter most (intent, business logic, design direction). But it can handle the things that require consistent, exhaustive attention across multiple dimensions simultaneously: security patterns, performance anti-patterns, readability issues, test coverage gaps. A human reviewer can hold two or three lenses at once; a multi-agent system can hold twenty.

This capstone builds a multi-agent code review pipeline that takes a diff and produces a structured, prioritized, non-repetitive review across multiple specialized lenses.

## Primary domains

| Domain | What this capstone exercises |
| --- | --- |
| `agentic-workflows` | parallel fan-out / fan-in, orchestrator-worker, critic-reviewer, structured output |
| `design-patterns` | observer, chain of responsibility, facade, decorator |
| `architecture` | hexagonal / ports and adapters, tool API design |

## What you'll build

**Orchestrator**: receives a PR diff (or a file patch, or a code snippet). Parses it into structured chunks. Dispatches work to specialized reviewer agents in parallel. Collects their outputs. Passes to a synthesizer.

**Specialized reviewer agents** (implement at least four):
- Security reviewer: injection risks, secrets in code, auth bypass patterns, insecure deserialization
- Performance reviewer: N+1 queries, missing indexes, unbounded loops, unguarded allocations
- Readability reviewer: naming, function length, cognitive complexity, missing documentation
- Test coverage reviewer: which paths have no test coverage, which edge cases are untested
- (Optional) Architecture reviewer: coupling concerns, dependency direction violations, abstraction leaks

**Synthesizer**: merges the outputs from all specialized agents. Deduplicates overlapping findings. Produces a single structured review with prioritized findings (P1/P2/P3), grouped by file and category.

**Evaluation framework**: measures the quality of the review over time against a golden set of known issues.

## Milestones

### Milestone 1: Single-agent sequential review (3-5 hours)
Build one agent that reviews a diff sequentially with three lenses: security, performance, readability. No parallelism yet — just a single agent with a well-designed system prompt that produces structured output.

This is a deliberate starting point. The sequential version is your baseline for comparison. It also forces you to design the output schema before you split the work across agents.

**Deliverable**: agent that produces a structured JSON review with at minimum: `findings[]` (each with `file`, `line`, `category`, `severity`, `description`, `recommendation`). Test it on 5 real diffs (find them in public open source repos).

---

### Milestone 2: Parallel fan-out (4-6 hours)
Split the sequential agent into parallel specialized agents. The orchestrator dispatches to all agents simultaneously and waits for all to complete. Measure: does parallel review produce better coverage than sequential? How much faster is it?

**Deliverable**: parallel review system with at least 3 specialized agents. A comparison of the sequential vs parallel outputs on the same 5 diffs from Milestone 1. A note on the latency vs thoroughness trade-off.

---

### Milestone 3: Synthesis agent (3-5 hours)
The parallel agents will produce overlapping and sometimes contradictory findings. Build a synthesis agent that:
- Deduplicates findings that refer to the same issue
- Resolves contradictions (performance agent says "add caching," architecture agent says "avoid caching here")
- Prioritizes findings by severity and file impact
- Produces a final review that reads as a single coherent document, not a concatenation

**Deliverable**: synthesizer that reduces a typical 15-20 raw findings to 6-10 prioritized, deduplicated findings with no repetition. Show before/after on one diff.

---

### Milestone 4: GitHub integration (3-5 hours)
Wire the system to a real GitHub repository. The orchestrator reads a PR diff via the GitHub API. The synthesizer posts the final review as PR comments (inline comments on specific lines where possible, a summary comment at the top of the PR).

**Deliverable**: end-to-end demo where you open a PR on a test repo, the system automatically reviews it, and inline comments appear. A runbook for how you'd operate this on a real team's PRs.

---

### Milestone 5: Review quality scoring (4-6 hours)
Build an eval suite. Create a golden set: 10 diffs where you know the correct findings (because the bugs are real and documented). Score the system on recall (how many known issues did it find?) and precision (how many findings were genuinely useful?).

**Deliverable**: eval report showing recall and precision. An honest analysis of where the system is weak and what you would change to improve it.

---

### Milestone 6: Learning over time (4-8 hours)
Track findings across reviews of the same codebase. Is the codebase getting better or worse at specific quality dimensions? Surface this as a trend report. Optionally: use past review history as context for new reviews ("this file has had 5 security findings in the last 10 PRs — pay extra attention").

**Deliverable**: a trend report generated from at least 10 reviews of the same codebase. A design doc explaining how past context is stored, retrieved, and injected.

---

## Technical guidance

**Schema design first**. Before writing any agent code, design the output schema. The synthesis agent can only do its job if the specialized agents produce consistent, structured output. Spend time on this at milestone 1 — changes to the schema after milestone 2 will break everything.

**Diff parsing is harder than it looks**. A raw git diff contains more information than the changed lines: it includes the surrounding context, the file path, the old and new line numbers. Decide how much of this context the agents need. Too little and they miss cross-line issues; too much and the context window fills up fast.

**The synthesis problem is an alignment problem**. Two agents reviewing the same code from different lenses may reach genuinely different conclusions. The synthesizer needs to resolve these — which requires a policy, not just deduplication. Write the policy down before implementing it.

**Measure first**. Run the system on 5 diffs and read every finding before you start optimizing. You will learn more from reading 50 raw findings than from reading 5 blog posts about multi-agent systems.

## Skills to build while working on this capstone

- `/review-diff` — runs the full multi-agent review on a provided diff or PR URL
- `/review-trend` — shows the quality trend for a given repository over the last N reviews
- `/review-explain` — asks the system to explain its reasoning for a specific finding

## Further depth

- `agentic-workflows/04-multi-agent-patterns/parallel-fan-out-fan-in/`
- `agentic-workflows/04-multi-agent-patterns/critic-reviewer/`
- `agentic-workflows/02-single-agent-design/structured-output/`
- `software-engineering/advanced-engineering/02-testing-and-verification/` — what good code review catches vs what tests catch
