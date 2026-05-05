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

---

## Clean Code Lens

**Principle in focus:** Precise Interface Contracts + Meaningful Field Names

The critic's output schema — `{ verdict, issues: [{ severity, message }] }` — is the interface between reviewer and author: every field name is a contract that the producer will act on in the next revision pass. A field named `issues` is specific; a field named `feedback` or `notes` is not — the producer must guess whether it is actionable, blocking, or merely informational. Naming fields from the consumer's perspective (what does the producer need to know to act?) produces a cleaner interface than naming them from the critic's perspective (what did I observe?).

**Exercise:** Audit your critic's output schema and rename each field by asking "what will the producer do with this?" — if the answer is "revise," name it `required_changes`; if the answer is "note for the record," name it `advisory_notes`; if the answer is "stop iterating," name it `blocking_issues`. Then check whether your retry runner logic simplifies once the fields have action-oriented names.

**Reflection:** The verdict enum has four values: `accept`, `accept_with_notes`, `revise`, `reject`. Each value is a named action, not a named quality level — the critic reports what to do next, not how good the artifact is. What clean code principle does that distinction reflect, and where else in software design do you see the same difference between status codes and action codes?
