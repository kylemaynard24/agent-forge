# Homework — Observability and Tracing

> Instrument an agent. Make every run inspectable.

## Exercise 1: Add tracing to your agent

Take any agent you've built. Add a `Tracer` that records:
- run_id
- per-step thought, action, observation
- tokens (in / out, even if estimated)
- per-step latency (ms)
- final outcome

Each run produces a JSON file in `./traces/<run-id>.json`.

**Constraints:**
- All steps go through the tracer — no exceptions.
- The trace is reasonable to read with `jq` or a JSON viewer.
- Sensitive data (API keys, user PII) is redacted before being written.

## Exercise 2: Aggregate metrics from traces

Write a small script that reads all traces in `./traces/`, computes:

- pass rate (success / total)
- median / p95 tokens per run
- median / p95 latency per run
- top 5 tools by call count
- failure-mode breakdown (timeout vs looping vs other)

Print the report. Save to `./metrics-summary.json`.

**Constraint:** the script is idempotent and reproducible. Running it twice on the same traces produces identical output.

## Exercise 3: Trace-driven debugging

Run your agent until you see a "weird" run (loop, off-task drift, hallucinated tool). Don't try to debug from memory.

Open the trace. Find the step where things went wrong. Identify:
- Which observation triggered the bad decision?
- What did the prompt at that step look like?
- What would you change to prevent it?

Write up the post-mortem in 1 page. (This is what production agent debugging looks like.)

## Stretch: PII / secret redaction

Add a redactor that scrubs:
- API key patterns (e.g., `sk-...` for OpenAI keys, `claude-...` for Anthropic, etc.).
- Email addresses.
- Common PII patterns.

Apply it to observations before they're written to traces.

**Constraint:** redaction is loud — replaces with `[REDACTED:KIND]`, not silent removal.

## Reflection

- "If you can't reconstruct a run, you can't debug it." Defend or refute.
- Why are run_ids more useful than timestamps for log correlation? (Hint: clock skew; concurrent runs.)
- What's the right balance between trace size and trace usefulness? (Hint: full prompts are huge; summarized prompts lose context.)

## Done when

- [ ] Every agent run produces a structured trace file.
- [ ] You have an aggregate metrics script.
- [ ] You've debugged at least one issue from the trace alone.
- [ ] PII is redacted from traces.
