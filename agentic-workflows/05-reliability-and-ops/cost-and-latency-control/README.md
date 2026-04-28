# Cost and Latency Control

**Category:** Reliability and ops

## Why this matters

LLM calls cost money and take seconds. An agent that loops 30 times might spend $0.50 and take 90 seconds — per task. Multiply by users, tasks, and you have a real bill and a real UX problem.

This topic is about the levers you control.

## The big levers

### 1. Pick the right model
Smaller models (Haiku, Mini) are 5-10x cheaper and faster than flagship models. For routine sub-tasks (summarize, classify, validate), they're often *good enough*.

Pattern: **route by complexity**. The orchestrator runs on the flagship model; workers run on smaller ones. Or: try the small model first; escalate on failure.

### 2. Prompt caching
For agents that re-send a stable system prompt (which is most agents), use prompt caching. Anthropic's API caches the prompt prefix; subsequent calls pay for only the new tail.

A 5K-token system prompt cached vs uncached: the cached version is cheaper after the first call. For agent loops with 20 calls, the savings are substantial.

In the Anthropic SDK: mark the cacheable parts with `cache_control`. Caches expire after 5 minutes (or longer with extended caching).

### 3. Parallelize what you can
Multiple `Agent` calls in one message → parallel. Total wall = max(individual). vs serial → total wall = sum(individual).

Same cost; better latency.

### 4. Cap loop steps
A loop with `maxSteps = 100` is a bug, not a feature. Most tasks complete in under 20 steps. Cap aggressively. Failure to complete in N is a signal worth surfacing.

### 5. Truncate observations
Verbose tool outputs bloat the prompt every iteration. Truncate aggressively (see `01-foundations/context-as-working-memory`).

### 6. Avoid unnecessary tool calls
A poorly-prompted agent calls `read_file` 3 times when it should have called `read_file_with_offset` once. Tool design is cost design.

## The right model for the right job

| Task | Model |
|---|---|
| Top-level orchestrator (decisions matter) | Flagship (Opus, GPT-4) |
| Specialist worker (focused, bounded) | Mid-tier (Sonnet, GPT-4o) |
| Routine classification / summarization | Small (Haiku, Mini) |
| LLM-as-judge for evals | Mid-tier (consistency matters) |
| Cheap aggregation (joining N results) | Small or skip LLM entirely |

Don't pay flagship prices for tasks a small model handles.

## Caching deep dive (Claude API)

Cache lifecycle:
1. First call: pay full price; the prefix is cached.
2. Subsequent calls within 5 minutes: pay 10% for cached input, full price for new input.
3. Beyond 5 minutes (default), the cache expires. Extended caching (1 hour) is available.

Cacheable: stable system prompts, tool definitions, large background context. Not cacheable: dynamic per-call content (the user's latest input).

Pattern:
```
[CACHED]
- system prompt
- tool defs
- background docs
[NOT CACHED]
- conversation history
- latest user input
```

For agents that loop within a 5-minute window, this is a 5-10x cost reduction.

## Latency tactics

### Parallel where possible
Already covered, but worth restating: free latency cuts.

### Streaming
For user-facing agents, stream the output as it generates. Total time may be the same; perceived latency is much shorter.

### Smaller models for time-sensitive work
A 200ms Haiku call beats a 2s Sonnet call when the task fits.

### Cache warming
For cold-start latency: pre-warm cached prompts on a schedule for high-frequency agents.

## What NOT to optimize for

- **"Lower temperature" doesn't reduce cost.** Same number of tokens.
- **"Shorter response"** has minimal impact unless responses are huge. Most cost is input tokens.
- **"Smaller batch sizes"** reduces parallelism without saving cost.

## Anti-patterns

- **Default model = flagship.** Most agents over-pay because the orchestrator picked the most capable model out of habit.
- **Re-sending the same long system prompt without caching.** Pure waste.
- **Truncating *responses* but not observations.** Responses are usually small; observations are the bloat.
- **No budget guardrails.** A runaway loop spends $$$ before anyone notices.

## Per-task budget

For production: every agent run has a budget cap.

```
budget = { max_tokens: 50_000, max_seconds: 60, max_dollars: 0.50 }
```

The loop checks against the budget at each iteration. Exceed → terminate with `reason: budget_exceeded`. Surface to user.

## Trade-offs

**Pros of cost control**
- Budget predictability.
- Faster iteration during development.
- Better UX (less waiting).

**Cons**
- Smaller models sometimes fail; need fallback.
- Caching introduces a TTL surface.
- Aggressive caps can terminate legitimate long-running tasks.

**Rule of thumb:** Measure before optimizing. The biggest wins usually come from picking the right model, caching the system prompt, and capping the loop.

## Real-world analogies

- Cloud cost optimization: right-sizing instances, reserved capacity, autoscaling.
- API rate limits and pricing tiers.

## Run the demo

```bash
node demo.js
```

The demo simulates four runs of the same task with different optimizations: baseline, with caching, with smaller workers, with parallelism. Compares cost and latency.

## Deeper intuition

Reliability topics force you to treat the model as a probabilistic subsystem inside a real product. That means watching cost, latency, drift, guardrails, observability, and human escalation paths with the same seriousness you would bring to any other production dependency.

The best way to study **Cost and Latency Control** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **Cost and Latency Control** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Human In the Loop or Observability and Tracing:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **Cost and Latency Control** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
