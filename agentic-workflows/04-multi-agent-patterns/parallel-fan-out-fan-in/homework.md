# Homework — Parallel Fan-Out / Fan-In

> Run N workers concurrently. Bound the width. Aggregate sensibly.

## Exercise 1: Map a task across many inputs

Pick a task: e.g., "summarize each of these 10 articles." Build a fan-out runner that:

- Dispatches workers in parallel batches of K (you pick K based on rate limits).
- Each worker is the same agent / same prompt, different input.
- Aggregates the per-item results into a final structure.

**Constraints:**
- Width is bounded (no spawning 100 at once).
- Failure of one worker doesn't kill the whole run — the runner reports which items failed.
- Total wall time is logged and proportional to ceil(N/K), not N.

## Exercise 2: Sampling for consensus

Same input, N workers, slight prompt variation (or just temperature variance). Aggregate by **majority vote** or **best-of-N**.

**Build:**
- 5 workers run the same review task on the same input.
- Aggregator picks the verdict that appears most often.
- If there's a tie, an extra "tiebreaker" run is dispatched.

**Constraint:** the per-worker variance must be real — temperature ≠ 0, OR distinct prompt seeds. Otherwise you're paying for 5 identical answers.

## Exercise 3: Aggregation by LLM

Replace the simple majority-vote with an aggregator agent. Feed all N worker outputs to it; it produces a synthesized summary or final answer.

**Constraint:** the aggregator's output is structured. It cites which workers contributed which findings.

## Stretch: Rate limits + retries

Add a real concern: rate-limited APIs.
- Honor a per-second cap (e.g., 5 requests/second).
- Retry transient failures (429s, 503s) with exponential backoff.
- Surface persistent failures as `failed_items` in the final report.

## Reflection

- Fan-out is "embarrassingly parallel." When does it become **embarrassingly expensive**?
- Sampling-for-consensus: why does running 5 similar prompts beat running 1? (Hint: variance reduction; outlier correction.)
- An aggregator agent introduces a new failure point. When is it worth it?

## Done when

- [ ] N independent tasks fan out in parallel batches.
- [ ] Width is bounded.
- [ ] Aggregation produces a structured final result.
- [ ] You've measured the wall-clock speedup vs. serial.
