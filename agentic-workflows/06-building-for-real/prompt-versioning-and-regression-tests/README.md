# Prompt Versioning and Regression Tests

**Category:** Building for real

## The problem

You change a prompt. You ship. Three days later a user reports a regression. You roll back to "the prompt before the last change" — but you have no way to know what that was.

Or: you have it but the rollback breaks something else, because two unrelated changes shipped together.

This is the prompt version-control problem. It's the same as the code version-control problem. The same discipline applies.

## What to version

For each agent / prompt:
- The system prompt.
- Tool definitions and descriptions.
- Memory / state strategy.
- Model identifier (`claude-sonnet-4-6`).
- Eval suite that gates the prompt.

Treat all of these as a unit. A "version" is a coordinated bundle.

## Version numbering

Two reasonable schemes:

### Semver-ish
- Major: behavioral change. ("v2.0.0 — fundamentally different output style.")
- Minor: capability add. ("v2.1.0 — added handling for X.")
- Patch: bug fix / clarification. ("v2.1.1 — fixed handling of empty input.")

### Date-based
- `2026-04-28-r1`. Linear, monotonic, no decisions.

For internal tooling, date-based is often cleaner. For public-facing agents (where downstream callers depend on behavior), semver is conventional.

## What goes in a version

A version is a *committed snapshot* with:

- The prompt blocks (or composed full prompt).
- The model + key sampling settings.
- The associated eval suite results.
- A changelog entry: what changed, why, eval results vs baseline.

Like a commit, but for the prompt-as-program.

## Regression tests

Every prompt version is gated by an eval suite (see `05-reliability-and-ops/evals-for-agents`). Before promoting a new version:

1. Run the suite on the new version.
2. Compare against the baseline (current prod version).
3. If pass rate drops or quality metrics regress, block the release.

This is regression testing for prompts. Skip it and you're trusting your taste.

## Linking outputs to versions

Every agent run logs the prompt version it used:

```json
{
  "run_id": "...",
  "prompt_version": "v2.1.0",
  "agent_outputs": [...]
}
```

When you investigate a bad run, the version tells you what was in effect. When you see a sudden quality shift in metrics, you can correlate with the version that rolled out.

## Promoting a version

A reasonable promotion flow:

1. Develop locally (`v2.2.0-dev`).
2. Pass eval suite at parity or better.
3. Roll out to staging / canary (1% of traffic).
4. Monitor metrics for 1-7 days.
5. Promote to 100% if metrics hold.
6. Mark prior version available for quick rollback.

This is the same release flow as code.

## What "rollback" means for prompts

A prompt rollback is:
- Switch the prompt back to the previous version.
- If memory / data shapes changed between versions, plan for compatibility (or roll those back too).
- Investigate after, before rolling forward again.

The harder case: the new prompt produced outputs that *trained downstream systems* (annotation, follow-on agents, etc.) on the new shape. Now rolling back the prompt also requires unwinding the downstream effects. Plan ahead.

## Anti-patterns

- **No version field.** "Last edit was Tuesday." That's a question, not a version.
- **Untested changes.** "Looks good to me." Eval the change.
- **Coupled changes.** Bundling a prompt rewrite with a tool refactor. Now you can't bisect a regression.
- **Stealth deployment.** Edits prompts in production without changelog. The version is "whatever's currently running."

## Trade-offs

**Pros**
- Rollback is fast.
- You can attribute behavior changes to specific versions.
- Onboarding new team members is easier (read the version history).
- Eval-gated releases catch regressions.

**Cons**
- Process overhead (especially if your team is one person).
- Versioning every prompt edit is heavy for fast prototyping.
- Eval suites need to be maintained.

**Rule of thumb:** Once an agent is in production and used by real users, version it. Skip in early prototyping.

## Real-world analogies

- Code versioning + CI/CD.
- Database migrations: each is a versioned, reversible step.
- Game patches with build numbers and changelogs.

## Run the demo

```bash
node demo.js
```

The demo simulates a versioned-prompt registry with associated evals. Two prompt versions; the runner picks one; logs the version; runs evals; reports pass rate.

## Deeper intuition

Building-for-real topics turn agent demos into systems that can survive repeated use. The key shift is from 'can the model do this once?' to 'can the whole surrounding system make this dependable, testable, evolvable, and operationally sane?'

The best way to study **Prompt Versioning and Regression Tests** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **Prompt Versioning and Regression Tests** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Capstone Design An Agent or Long Running Agents:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **Prompt Versioning and Regression Tests** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
