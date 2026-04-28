# Homework — Failure Modes

> Build the safety nets. Each named failure mode has a name and a response.

## Exercise: A failure-mode-aware loop

Take any agent loop you've built. Add detection for at least 6 of these:

1. Infinite loop (repetition)
2. Off-task drift
3. Hallucinated tool
4. Schema violation
5. Cost runaway (budget)
6. Stale memory
7. Prompt injection (basic detection)
8. Confidently wrong (LLM-as-judge of confidence)
9. Premature finish
10. Tool timeout

For each you implement:
- A detector.
- A specific termination reason.
- A response (terminate, retry, surface to LLM, escalate to human).

**Constraints:**
- The loop never throws. Every termination has a named `reason`.
- Each reason is loggable, alertable, dashboardable.
- Your loop's `return` shape is `{ status, reason, output, trace }`.

## Stretch 1: Reproduce the failures

For each failure mode you implemented, write a stub LLM that reliably triggers it. Build a test that runs your loop with that stub and asserts the correct termination reason fires.

This is your "regression suite for the safety net."

## Stretch 2: Off-task drift detection

The hardest one. Write an LLM-as-judge that, given the original goal and the agent's last 3 actions, decides "on task" or "drifting." Surface drift as a warning observation (not termination) — let the agent self-correct.

**Constraint:** the judge runs occasionally (e.g., every 5 steps), not every step. It's a sentinel, not a chaperone.

## Reflection

- "Detection is the safety net; prevention is design." Argue this. (Hint: prevention reduces frequency; detection bounds blast radius.)
- Why is "off-task drift" the hardest to detect? (Hint: relevance is contextual.)
- A loop that returns "success" without a reason is fine. A loop that returns "failure" without a reason is a bug. Why?

## Done when

- [ ] Your loop detects at least 6 named failure modes.
- [ ] Each termination has a specific reason.
- [ ] You have tests that reproduce each failure and verify the right reason fires.
- [ ] You can map each reason to a real-world alert / dashboard.
