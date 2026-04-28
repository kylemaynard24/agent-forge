# Homework — The Agentic Loop

> Implement the loop. Then break it on purpose, and add the safety nets that production agents rely on.

## Exercise 1: Add three termination conditions

Take the demo's loop. Currently it terminates on (a) a `finish` tool call or (b) `maxSteps`. Add three more:

1. **Wall-clock budget.** A `maxWallMs` option. If the loop has been running longer than that, exit with reason `timeout`.
2. **Repeated-action detector.** If the agent calls the same tool with the same arguments twice in a row, exit with reason `looping`.
3. **No-tool-call response.** If the LLM returns no action (just plain text), treat that as an implicit `finish` with the text as the answer.

**Constraints:**
- Each termination reason must be reported in the loop's return value: `{ status, answer, reason, steps }`.
- The loop must not throw. It always returns cleanly.
- The repeated-action detector must use a stable key (canonicalize args before comparing).

## Exercise 2: Build a "ReAct trace" exporter

Modify the loop to record a structured trace of every step: `[{ step, thought, action, observation, ms }]`. Save this trace to a JSON file at the end of the run.

The trace is your debugging tool when something goes wrong. Without it, you're guessing.

**Constraint:** the trace must be readable on its own — no in-memory cross-references. You should be able to email it to a teammate and they can reproduce your bug.

## Exercise 3: Inject a flaky tool

Modify the demo to use a `read_file` tool that fails 30% of the time with a transient error. Update your loop's behavior — should the agent retry? Should the loop retry? Should it just be reported as an observation and let the LLM decide?

Pick **one** strategy and defend it. (There's no single correct answer; defending matters more than picking.)

**Hint:** the most robust answer in real systems is "let the LLM decide" — the loop just surfaces the error as an observation. The LLM either retries by calling the tool again or gives up. This keeps the loop simple and the policy in the prompt.

## Stretch: Plan-then-act

Variant: change the loop so the *first* step asks the LLM for a numbered plan, and subsequent steps execute the plan items. The loop now has two modes: planning and executing. What new failure mode does this introduce? (Hint: what happens when an executing step's observation invalidates the plan?)

## Reflection

- Why is termination the part of agent design that breaks first in production? (Hint: most demos solve their canned task in 3 steps; real tasks vary widely.)
- The demo treats *thought* as decoration. The model emitted it but the loop doesn't act on it. In practice, do you keep thoughts in the history or strip them? Argue both sides.
- A loop with no observations is a workflow. A loop with no choices is a pipeline. A loop with no termination is a bug. Pick one of those three and explain how you'd notice the failure in a real product.

## Done when

- [ ] Your loop has at least 5 distinct termination conditions, each with a named reason.
- [ ] You can run a "broken" agent (deleted `finish` from the script) and the loop exits cleanly via a non-completion reason.
- [ ] You have a JSON trace file you'd be willing to share with a teammate.
- [ ] You can describe what happens when a tool throws, when the LLM hallucinates a tool, and when the agent loops — without re-reading the README.
