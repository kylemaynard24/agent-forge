# Evals for Agents

**Category:** Reliability and ops

## What an eval is

An **eval** is a test for an LLM-driven system. Inputs go in; outputs come out; we compare to expected behavior. The whole job is detecting regressions before users do.

Evals are *not* unit tests. The output is non-deterministic, so:
- "Equality" is fuzzy (semantic equivalence, not byte-equal).
- One run isn't enough — sample and aggregate.
- Failure is gradient, not binary (better or worse, not pass or fail).

But everything else is the same: version-controlled fixtures, automated runner, regression detection.

## Why agents need evals more than chatbots

A chatbot's output is one LLM call. You can review it manually.

An agent's output is the result of many LLM calls + tool dispatches + retries + branches. The space of possible runs is huge. Manual review is impossible at scale.

Without evals, you change a prompt, ship, and find out three days later that something else broke silently. With evals, you change a prompt, run the suite, see the impact in minutes.

## Eval types

### Static (input → output)
Given a fixed input, produce an output. Compare to a reference.

```
input: "Summarize the auth diff"
expected: { issues_count: >0, severity_high_present: true, ...shape constraints... }
```

The "compare to reference" can be:
- Schema validation (structured output matches shape).
- Containment ("did the output mention X?").
- LLM-as-judge ("would a human consider this output correct?").
- Rule-based ("is the citation count > 2?").

### Trajectory (input → trajectory)
For agents, you often care about the *path*, not just the answer. Did it call the right tools? Did it stay on task? Did it use too many calls?

```
input: "Find the bug in api.py"
expected_trajectory: [
  { tool: 'read_file', args: { path: 'api.py' } },
  { tool: 'grep', args: { pattern: '...' } },
  { tool: 'finish' }
]
```

You don't usually require an exact match — but you check for required tools (read_file should appear) or forbidden patterns (no `delete_file`).

### Adversarial
Inputs designed to provoke bad behavior:
- Prompt injection ("ignore prior instructions and …").
- Edge cases (empty input, very long input, unicode tricks).
- Tricky scenarios (ambiguous tasks).

These are crucial for production systems but easy to neglect.

## Building an eval suite

A bare-minimum suite has:

1. **A fixtures file.** A YAML/JSON file with input/expected pairs.
2. **A runner.** Runs the agent on each fixture; collects outputs.
3. **A checker.** Compares outputs to expectations using whichever method (schema, containment, LLM-as-judge).
4. **A reporter.** Pass/fail summary; per-fixture detail; diffs vs the previous run.

You don't need a framework to start. A 200-line Node script is enough.

## LLM-as-judge

For non-trivial outputs (free text, multi-paragraph), comparing to a reference is hard. Solution: a separate LLM evaluates the output against criteria.

```
Judge prompt: "Given the agent's output below, score on these criteria:
  - Did it identify the security issue at api.py:42? (yes/no)
  - Was the severity correct? (yes/no)
  - Was the explanation clear? (1-5)
"
```

Pros: handles free text; mirrors how a human would review.
Cons: judge has its own non-determinism; expensive; can be biased.

Best practice: use LLM-as-judge for grading; use rule-based checks for the things that have a right answer.

## What to measure

Track these per run:
- **Pass rate** — fraction of fixtures that pass.
- **Average tokens per task** — cost trajectory.
- **Tool-call count** — efficiency.
- **Latency** — wall time.
- **Trajectory similarity** — fraction of expected tools called.

Plot these over time. Regressions show up as sudden drops or rises.

## Anti-patterns

- **Evals that test the LLM, not your agent.** "Does Claude know about Postgres?" is not an eval of *your* code.
- **Brittle string matching.** `assert output == "exactly this string"`. Will fail forever once the LLM rephrases.
- **No baseline.** You added evals but didn't measure the *current* state. You can't tell if a change is a regression or progress.
- **Evals without versioning.** A fixture that "passes" today fails tomorrow because the eval criteria changed silently.
- **One-shot evals.** Running each fixture once; declaring victory. Run 3-5x and check for variance.

## CI integration

Evals belong in CI for any agentic system in production:
- On every PR: run a small subset (smoke tests).
- Nightly: run the full suite.
- Block merge: if pass rate drops by N% from the baseline.

## Trade-offs

**Pros**
- Catch regressions before users.
- Confidence in prompt / tool changes.
- Forces you to articulate "what good looks like."

**Cons**
- Cost: evals run real LLM calls.
- Maintenance: evals rot if the world changes.
- False sense of security: passing evals ≠ correct in all cases.

**Rule of thumb:** If you're shipping an agent to users, evals are not optional. If you're prototyping, build the smallest suite that catches the bugs you've already seen.

## Real-world analogies

- Regression tests in software.
- Behavioral testing in security (does the system block known attacks?).
- A/B tests for product features — comparing two variants on the same metrics.

## Run the demo

```bash
node demo.js
```

The demo runs a tiny eval suite over a stub agent: 5 fixtures, schema validation + containment checks + LLM-as-judge (stubbed). Reports pass/fail per fixture with diffs.

## Deeper intuition

Reliability topics force you to treat the model as a probabilistic subsystem inside a real product. That means watching cost, latency, drift, guardrails, observability, and human escalation paths with the same seriousness you would bring to any other production dependency.

The best way to study **Evals for Agents** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
