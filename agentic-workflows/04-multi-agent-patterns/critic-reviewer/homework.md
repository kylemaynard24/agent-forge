# Homework — Critic / Reviewer

> Two agents, one quality bar. Bound the loop.

## Exercise: Build a producer + critic for any small task

Pick a task with a clear "right shape" output. Examples:
- Generating a structured Q3 plan.
- Writing a unit test that hits 3 edge cases.
- Drafting a commit message that follows your team's policy.

**Build:**
- A **producer** agent that drafts the artifact.
- A **critic** agent that reviews it against rules. Critic returns `{ verdict, issues }`.
- A runner that loops `produce → critique`. Caps at 3 revisions.

**Constraints:**
- Producer and critic are *separate* agents (different system prompts).
- Critic's `issues` are structured (severity + message). The producer reads them on the next pass.
- Verdict is one of `accept`, `accept_with_notes`, `revise`, `reject`.
- The runner exits cleanly on accept or after the cap.

## Stretch 1: Multi-critic

Replace the single critic with **two specialists** (e.g., a `format-critic` and a `content-critic`). Run both in parallel; merge their findings; producer revises based on the merged feedback.

This is the `/review-crew` pattern at small scale.

## Stretch 2: Calibrated severity

Tune your critic so:
- It blocks (verdict: `revise`) only on **high**-severity issues.
- **Low**-severity issues become notes attached to an `accept_with_notes`.

Now run the loop on 5 different tasks. Does the loop terminate quickly enough? Are real issues being caught? Tune the criteria.

## Reflection

- "A critic is more useful than a more careful producer." When is this true; when is it false? (Hint: critics are independent reads; more carefulness is still self-evaluation.)
- "A critic that finds zero issues every time is broken." Defend or refute. (Hint: maybe the producer is genuinely good — or the critic isn't catching what's there.)
- The bounded loop terminates after N revisions. What's the right N? (Hint: depends on cost; usually 2-3.)

## Done when

- [ ] Producer + critic with structured I/O.
- [ ] Bounded loop terminates correctly.
- [ ] You can articulate when single-pass suffices vs when revise pays off.
- [ ] You've measured: how often does revise produce a real improvement?
