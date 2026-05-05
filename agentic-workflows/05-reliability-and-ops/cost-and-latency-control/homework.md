# Homework — Cost and Latency Control

> Measure your agent's spend. Apply two levers. Compare.

## Exercise 1: Measure

Take an agent you've built. Run it on 10 representative tasks. Capture:
- Total tokens (input + output) per run.
- Latency per run.
- Estimated cost per run (using your provider's pricing).
- Median, p50, p95.

Save the results in a CSV. This is your **baseline.**

## Exercise 2: Apply two levers

Pick TWO of these:
- **Prompt caching.** Mark the system prompt cacheable. Re-run; compare.
- **Smaller models for workers.** Route worker tasks to a smaller model. Re-run; compare.
- **Parallelism.** Run independent calls in parallel. Re-run; compare.
- **Observation truncation.** Cap each observation at 1KB. Re-run; compare.
- **Budget caps.** Add a max-tokens / max-seconds gate. Re-run; ensure no false-positives.

Re-measure. Compute the savings. Document.

**Constraints:**
- The optimizations must not regress quality. Run your eval suite (from `evals-for-agents`) before and after.
- Each lever is applied in isolation, then together. Show the additive effect.

## Exercise 3: Add a budget cap

Implement: each run has a max budget (`{ max_tokens: 50_000, max_seconds: 60, max_dollars: 0.50 }`). The loop terminates if any cap is exceeded.

**Constraints:**
- Termination is logged: which cap, by how much.
- The agent's trace records its budget usage at each step.
- The cap is configurable — different agents have different budgets.

## Stretch 1: Model routing

Implement smart routing: orchestrator runs on flagship; classifies the subtask difficulty; routes to small/mid/flagship based.

If a small-model call fails (low confidence; bad output), automatically retry with a larger model.

## Stretch 2: Cost regression alert

Run your eval suite under two prompt versions (an old and a new). Compute cost-per-task for each. If the new version is 20%+ more expensive without quality gain, flag it.

This is your "did we just break our budget?" alarm.

## Reflection

- "Pick the right model for the job" — but most teams pick flagship by default. Why? (Hint: developer ergonomics; fear of regression.)
- Caching saves money; it doesn't save *latency*. Why? (Hint: the model still has to process — but at lower cost.)
- A 100-step loop is almost always a sign of something wrong. Why? (Hint: design failure; loop-detection failure; vague tools.)

## Done when

- [ ] You have a measured baseline.
- [ ] You've applied at least two levers and measured the impact.
- [ ] You have a budget cap that terminates runaway runs.
- [ ] You can articulate which lever bought you the most, and why.

---

## Clean Code Lens

**Principle in focus:** Named constants over magic numbers

A budget cap written as `{ max_tokens: 4096, max_seconds: 60, max_dollars: 0.50 }` scattered across three agents is a maintenance hazard — change the policy and you hunt for every literal. `AGENT_MAX_TOKENS_PER_CALL`, `AGENT_TIMEOUT_SECONDS`, and `AGENT_BUDGET_DOLLARS` are policy names, not just values; they make the intent visible and make a policy change a one-line edit.

**Exercise:** Find every numeric limit in your agent code (token caps, timeouts, retry counts, observation truncation sizes) and extract each one into a named constant whose name states the constraint it enforces, not just the thing being limited.

**Reflection:** If the cost model for your LLM provider changes and you need to halve your per-call token budget, how many places in your codebase would you need to update — and how would you know you found all of them?
