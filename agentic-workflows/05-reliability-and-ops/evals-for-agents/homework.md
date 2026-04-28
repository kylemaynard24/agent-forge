# Homework — Evals for Agents

> Build a small eval suite. Run it. Make it useful.

## Exercise 1: Build a 5-fixture suite

Pick an agent you're working on (or one of the demo agents from earlier topics). Build:

- 5 fixtures, each with a structured input and 1-3 checks.
- Check types: at minimum schema + containment + min-count.
- A runner that produces a per-fixture pass/fail report.

**Constraints:**
- Each fixture is self-contained (no shared state).
- Each check tests an *aspect* of correctness, not byte-equality.
- The suite runs in under 30 seconds (pick small inputs).

## Exercise 2: Add LLM-as-judge

For free-text outputs, add an `llm_judge` check type:

```js
{ type: 'llm_judge', criteria: 'Did the agent identify a security issue?', expected: 'yes' }
```

The judge is itself an LLM call (stub it if you don't have an API key). Returns yes/no with rationale.

**Constraints:**
- The judge sees the input, the agent's output, and the criterion. It does NOT see the expected answer.
- Multiple criteria can be combined (AND).
- The judge's verdict and rationale are recorded.

## Exercise 3: Trajectory checks

Modify your runner to capture not just the final output but the *trajectory* — every tool call and observation.

Add a `trajectory_contains` check: the trajectory must include a tool with given name. Add `trajectory_excludes`: the trajectory must NOT include a tool (e.g., `delete_file` for a read-only review).

**Constraint:** the trajectory check is at the level of *intent*, not exact match. "Read some file" is fine; "read api.py specifically" is not (too brittle).

## Stretch: CI integration

Wire your suite into CI (GitHub Actions or similar):

- On PR: run a small subset (smoke).
- On main: run the full suite.
- Block merge if pass rate drops by 10% from the baseline.

The baseline is committed in the repo; updates require explicit approval.

## Reflection

- Why is "pass/fail" too coarse for agents? (Hint: the value of an output is a gradient.)
- LLM-as-judge introduces another LLM in the eval loop. What's the failure mode? (Hint: judge bias; judge non-determinism.)
- A passing eval suite ≠ correct agent. What does it actually tell you? (Hint: "no regression on these inputs"; not "no bugs.")

## Done when

- [ ] You have a 5+ fixture eval suite.
- [ ] You have at least 3 distinct check types.
- [ ] You can articulate what your evals do and don't catch.
- [ ] You have a baseline measured; you can detect regressions.
