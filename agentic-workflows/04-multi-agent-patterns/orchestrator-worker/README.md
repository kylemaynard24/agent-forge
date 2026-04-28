# Orchestrator-Worker

**Category:** Multi-agent patterns

## The pattern

One **orchestrator** agent decomposes a task and delegates the parts to one or more **worker** agents. Workers do the focused work and return results. Orchestrator integrates and produces the final answer.

```
                    ┌──────────────┐
                    │ Orchestrator │
                    └──────┬───────┘
                           │ delegate
                ┌──────────┼──────────┐
                ▼          ▼          ▼
            ┌──────┐  ┌──────┐   ┌──────┐
            │Worker│  │Worker│   │Worker│
            └──────┘  └──────┘   └──────┘
                │          │          │
                └──────────┼──────────┘
                           ▼ (results)
                    ┌──────────────┐
                    │  Synthesize  │
                    └──────────────┘
```

This is the foundational multi-agent pattern. Most others are variations.

## When to use

- The task decomposes naturally into subtasks.
- The subtasks need different specializations (security, perf, readability).
- You want the orchestrator's context to stay clean — workers absorb the noise.
- The subtasks are roughly independent (no strict ordering between them).

## When not to

- The task is sequential — A then B then C, where B needs A's output. Just write a workflow with one agent.
- The task is too small. The orchestration overhead exceeds the gains.
- The workers would each need most of the orchestrator's context. Then they're not really independent — and you're paying for the privilege.

## Implementation in Claude Code

The main session is the orchestrator. It uses the `Agent` tool to spawn workers:

```js
// In the orchestrator's run:
const securityReport = await Agent({
  description: "Security review",
  subagent_type: "security-reviewer",
  prompt: "Review the diff for security issues. Specific concerns: XSS in templates, SSRF in fetch handlers."
});

const perfReport = await Agent({
  description: "Performance review",
  subagent_type: "perf-reviewer",
  prompt: "Review the diff for performance regressions. Focus on the new query in users.py."
});

// Synthesize.
const finalReport = combine(securityReport, perfReport);
```

In Claude Code, multiple `Agent` calls in **one message** run in parallel. Two `Agent` calls in *separate* messages run sequentially.

## Briefing workers

The orchestrator's quality depends entirely on how it briefs workers. Workers don't see the orchestrator's conversation. Each must be self-contained.

A good brief includes:
- **What you're trying to accomplish** (the higher-level goal).
- **What the worker should specifically do** (their slice).
- **Context the worker needs to make judgment calls** (constraints, prior decisions).
- **Format / length expected** ("under 300 words"; "structured JSON").

A bad brief is terse: "review this file." The worker has to guess what kind of review.

(See `03-claude-code-primitives/subagents` for more on briefing.)

## Synthesis

After workers return, the orchestrator must combine their outputs. Three flavors:

- **Append.** Just concatenate. Useful when reports are independent and full content matters.
- **Filter / dedupe.** Combine, drop overlaps. Useful when workers may have found the same issue.
- **Reconcile.** Pick winners when workers disagree. Useful for review workflows.

Synthesis is its own LLM call (or a structured merge). Don't skimp; bad synthesis defeats the value of running multiple workers.

## Anti-patterns

- **The micro-orchestrator.** Spawning a worker to read one file. Just read it directly.
- **The chatty orchestrator.** Calling 8 workers when 2 would do. Each spawn costs.
- **The unbriefed worker.** Vague task; surprising output.
- **The serial "parallel" orchestrator.** Calling `Agent` in 5 separate messages — these run *sequentially*. Put them in one message for parallel execution.
- **The orchestrator that does the worker's job.** If you're doing all the work and just naming it after a worker, you've added a name without adding decomposition.

## Trade-offs

**Pros**
- Specialization — each worker can have its own tool allowlist and system prompt.
- Context isolation — orchestrator stays clean.
- Parallelism — independent workers run concurrently.
- Auditability — you can inspect each worker's report.

**Cons**
- Higher cost (multiple LLM calls per task).
- Synthesis introduces a new failure point.
- Coordination complexity grows quickly with worker count.

**Rule of thumb:** Use orchestrator-worker for 2-5 workers. Beyond that, consider hierarchical (next topic) or rethinking the decomposition.

## Real-world analogies

- A general contractor managing electrician, plumber, framer, painter. Each specialist is independent; the GC integrates.
- An editor delegating sections to writers and stitching the article together.

## Run the demo

```bash
node demo.js
```

The demo simulates an orchestrator that fans out to three "workers" (stub LLMs) in parallel and synthesizes. It compares wall-clock time of parallel vs serial dispatch.

## Deeper intuition

Multi-agent patterns are coordination strategies, not magic multipliers. They help only when splitting the work reduces cognitive load more than it increases communication overhead, synthesis work, and opportunities for contradictory conclusions.

The best way to study **Orchestrator-Worker** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
