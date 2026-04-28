# Observability and Tracing

**Category:** Reliability and ops

## Why agents need their own kind of observability

Traditional observability — logs, metrics, traces — applies, but agents have unique signals:

- **Per-run trajectories.** Each run is a sequence of LLM calls and tool calls. You want to see the path.
- **Token / cost** per run.
- **Tool dispatch outcomes** — success rate, retry rate, hallucinated tools.
- **Prompt versions** in effect for each run.
- **Outcome quality** — did the user accept or reject the result?

Without these, you can't debug ("why did the agent loop here?") or improve ("which prompt change made it slower?").

## The minimum viable trace

For each agent run, capture:

```json
{
  "run_id": "abc123",
  "started_at": "...",
  "ended_at": "...",
  "goal": "...",
  "outcome": "success | failure | timeout",
  "steps": [
    {
      "step": 1,
      "thought": "I should read the file first.",
      "action": { "tool": "read_file", "args": { "path": "..." } },
      "observation": "...",
      "tokens_in": 1234,
      "tokens_out": 56,
      "ms": 800
    },
    ...
  ],
  "totals": { "tokens": 4567, "ms": 12000, "cost_usd": 0.05 },
  "prompt_version": "v1.3"
}
```

This is enough for 80% of debugging.

## Three axes of observability

### 1. Logs
Per-run, per-step events. Easy. Often the first thing you build.

Use **structured logging**: every log line is JSON with `run_id`, `step`, `tool`, etc. — not freeform text. Structured logs are queryable.

### 2. Metrics
Aggregate signals over time. Examples:
- Tool-success rate.
- Tokens per task (median, p95).
- Latency per task.
- Failure-mode counts (timeout, looping, schema-failed).

Useful for "is the system healthy *over time*?" Less useful for individual debugging.

### 3. Traces
Causally-linked timeline of operations. For a single run, see exactly when each step happened, how long it took, what nested operations occurred.

For multi-agent systems, traces show the spawning tree: orchestrator spawned worker A, which spawned worker B…

## Practical setup

For a small system:
- **Logs:** structured JSON to stdout / a file. `pino`, `winston`, or just `console.log({...})`.
- **Metrics:** aggregate from logs (don't need a Prometheus on day 1).
- **Traces:** a per-run JSON file in `./traces/<run-id>.json`. Inspect with `jq` or a viewer.

For a production system:
- Logs → centralized (e.g., CloudWatch, Datadog).
- Metrics → time-series (Prometheus / Datadog).
- Traces → distributed tracing (Jaeger / Honeycomb / OpenTelemetry).

## Cost as an observability axis

Tokens are dollars. Treat token consumption like CPU usage — you measure, alert, regress.

Track per:
- **Run:** total tokens / cost.
- **Step:** tokens for each LLM call.
- **Tool:** which tools precede expensive calls.
- **User / project:** who's spending what.

Cost regressions are common: a prompt edit that adds 500 tokens to every call is invisible in logs but doubles your bill.

## Anti-patterns

- **Free-text logging.** "Agent did stuff." Useless.
- **Logging the prompt verbatim.** Fine in dev; in prod, you may log secrets. Redact.
- **No run_id correlation.** Logs scattered across files; can't reconstruct a run.
- **Sampling-only.** "We log 1% of runs." Fine for stable systems; terrible for new ones.
- **Metrics without alerts.** A dashboard nobody looks at didn't help anyone.

## Trace-driven debugging

When something goes wrong, the trace is the source of truth:

```
$ cat traces/abc123.json | jq '.steps[] | {step, tool, observation}'
```

You see exactly:
- Which tool was called when.
- What it returned.
- Where the agent went off-script.

This is faster and more reliable than reading prompts and guessing.

## Trade-offs

**Pros**
- Debug-ability: postmortem any run.
- Cost control: spot regressions in tokens / latency.
- Quality tracking: outcome metrics.
- User trust: auditable runs.

**Cons**
- Storage cost (especially full traces).
- Privacy concerns (prompts may include user data).
- Overhead (every step writes to a logger).

**Rule of thumb:** Build the per-run JSON trace first. Logs and metrics layer on top. Don't over-engineer until you've felt a real debugging pain.

## Real-world analogies

- Distributed tracing in microservices (OpenTelemetry, Jaeger).
- A flight data recorder. Always running. Sealed. Inspectable after a crash.
- Git log + diff: the trace of how the codebase got here.

## Run the demo

```bash
node demo.js
```

The demo runs a tiny agent and produces a trace JSON file showing per-step timing, tokens, and tool calls. You can inspect it with `cat ./demo-trace.json | jq`.

## Deeper intuition

Reliability topics force you to treat the model as a probabilistic subsystem inside a real product. That means watching cost, latency, drift, guardrails, observability, and human escalation paths with the same seriousness you would bring to any other production dependency.

The best way to study **Observability and Tracing** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **Observability and Tracing** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Guardrails or Human In the Loop:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **Observability and Tracing** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
