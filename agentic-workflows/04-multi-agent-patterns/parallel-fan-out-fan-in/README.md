# Parallel Fan-Out / Fan-In

**Category:** Multi-agent patterns

## The pattern

The orchestrator dispatches **N independent workers** in parallel. They run concurrently. Their results are collected (fan-in) and either merged or returned individually.

```
                    ┌──────────────┐
                    │ Orchestrator │
                    └──────┬───────┘
                           │ fan-out (parallel)
            ┌──────┬───────┼──────┬──────┐
            ▼      ▼       ▼      ▼      ▼
          [A]    [B]     [C]    [D]    [E]
            │      │       │      │      │
            └──────┴───┬───┴──────┴──────┘
                       │ fan-in (collect)
                       ▼
                 ┌─────────────┐
                 │  Aggregator  │
                 └─────────────┘
```

This is orchestrator-worker with N peer workers (no specialization needed) and a *known plurality* — you know up front you'll have N workers.

## When to use

- The same task on N different inputs (review 10 files; run 5 evals; analyze each row of a table).
- The same task with N different parameters (try 5 strategies; sample 10 prompt variations).
- The same input through N different evaluators (security + perf + readability — overlap with orchestrator-worker).

## When not to

- Workers depend on each other's results (you need a pipeline or basic loop).
- The fan-out width is unknown or unbounded — you may overwhelm budgets.
- The cost of N workers exceeds the value (one careful agent might do as well).

## Implementation

In Claude Code: multiple `Agent` calls in **one message** run in parallel. The harness sends them off concurrently and the orchestrator's next message contains all results.

```js
const results = await Promise.all(
  files.map(f => Agent({
    description: `Review ${f}`,
    subagent_type: 'reviewer',
    prompt: `Review the file at ${f}.`
  }))
);
```

In a non-Claude-Code context with the Anthropic SDK, fan-out means firing N API calls in parallel. Be aware of rate limits.

## Width control

Unbounded fan-out is dangerous. Two patterns to bound it:

### Hard cap
"At most 5 workers, ever." Predictable cost; might leave work undone if N > 5.

### Batched
Process in chunks of K (5 at a time). All chunks complete before producing the final result.

```js
async function batched(items, k, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += k) {
    out.push(...await Promise.all(items.slice(i, i + k).map(fn)));
  }
  return out;
}
```

This is the right default — fast for small N, bounded for large N.

## Aggregation strategies

Once workers return, you must combine. Options:

- **Append.** All results, concatenated. Useful when each result is independent.
- **Vote.** Workers ran the same task; pick the majority answer. Useful for consensus / robustness.
- **Best-of-N.** Pick the highest-quality result by some metric. Useful for sampling.
- **Reduce.** Custom merge logic. Most flexible.

For LLM-based aggregation: feed all worker results to an aggregator agent that produces a synthesized answer.

## Anti-patterns

- **Unbounded fan-out.** "We'll run a worker per row." A 10K-row dataset = 10K LLM calls. You'll get rate-limited and you'll spend a fortune.
- **Identical workers.** Running 5 of the same agent on the same input adds cost without diversity. Use sampling (different temperature, different prompt variants) for that to be useful.
- **No aggregator.** N results, no synthesis — you've passed the problem to the user.
- **Hidden dependencies.** Worker B "needs" worker A's result but you fanned them out anyway. Now you have a race.

## Trade-offs

**Pros**
- Wall-clock parallelism — N tasks in ~1 task's time.
- Embarrassingly parallel work fits naturally.
- Bounded width is easy to enforce.

**Cons**
- Cost scales linearly with N.
- Aggregation can be tricky (especially with disagreeing results).
- Hits rate limits on real APIs.

**Rule of thumb:** Use fan-out when tasks are *truly independent* and the fan-out width is bounded or batched. Default to batches of 3-5.

## Real-world analogies

- Map step in MapReduce. Distribute work across workers; collect; reduce.
- A team triaging 50 inbound bug reports — divvied up, each person reviews their share.

## Run the demo

```bash
node demo.js
```

The demo fans out across 8 inputs with a batch size of 3 and aggregates with a simple "majority vote" reducer.

## Deeper intuition

Multi-agent patterns are coordination strategies, not magic multipliers. They help only when splitting the work reduces cognitive load more than it increases communication overhead, synthesis work, and opportunities for contradictory conclusions.

The best way to study **Parallel Fan-Out / Fan-In** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **Parallel Fan-Out / Fan-In** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Hand Off vs Delegation or Hierarchical:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **Parallel Fan-Out / Fan-In** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
