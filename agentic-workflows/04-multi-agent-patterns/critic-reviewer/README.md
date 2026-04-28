# Critic / Reviewer

**Category:** Multi-agent patterns

## The pattern

A second agent reviews the first agent's output. The critic looks for problems the producer missed — bugs, gaps, weaknesses, factual errors. Outputs are scrutinized before being accepted.

```
producer → output → critic → { accept | revise | reject }
                                      │
                                      ▼ (if revise)
                                 [back to producer]
```

This is the simplest form of multi-agent disagreement, and one of the most useful in production.

## Why critics work

A model evaluating its own output suffers from a confirmation bias: it generated the output, it tends to defend it. A *separate* agent — fresh context, a different role — looks at the artifact without prior commitment.

A critic is to an agent what a code reviewer is to an engineer: not infallible, but valuable precisely because it isn't the producer.

## When to use

- Output quality matters more than speed.
- The producer's mistakes are common and recognizable.
- A second LLM call is affordable.
- You can express "what good looks like" well enough for a critic.

Real-world examples:
- The `/review-crew` slash command in this repo: parallel critics (security, perf, readability) over the same diff.
- Multi-pass writing: a writer drafts; an editor critiques.
- Code-gen agents: produce code → critic checks for hallucinated APIs / missing tests.

## When not to

- Tight latency budgets — every critic call is added latency.
- Producer's output is clearly correct (a critic on a passing test run is wasted work).
- You can't articulate what the critic should look for.

## The accept-revise-reject loop

The critic's output controls the next step:

- **Accept**: the work is good enough; ship it.
- **Revise**: the work has fixable issues; send the critique back to the producer for a revision.
- **Reject**: the work is fundamentally wrong; producer must restart with new approach.

Revise is the most useful in practice. A bounded loop (max 2-3 revisions) lets quality converge without infinite cost.

## Designing a good critic

The critic is its own agent. Key design points:

- **Different tools.** A critic might have read-only access; the producer has write access.
- **Different framing.** Producer's prompt: "do this." Critic's prompt: "find problems with this."
- **Structured output.** Critic returns `{ verdict, issues, suggestions }` so the producer can act on it.
- **Calibrated severity.** Not every issue is a blocker. Critic should mark severity so the loop doesn't churn on minor nits.

## Multiple critics

Sometimes one critic isn't enough. Specialized critics — security, performance, style — each look at the same output through their lens. Their findings merge.

This is exactly the pattern the `/review-crew` command uses. It's parallel orchestrator-worker where the workers are critics with different specialties.

## Anti-patterns

- **The over-eager critic.** Finds something to complain about every time. The producer ends up in a death spiral. Calibrate severity.
- **The same-agent critic.** Asking the producer to "double-check yourself." Cheaper but suffers confirmation bias.
- **The unbounded loop.** Revise → revise → revise → … Cap revisions.
- **The critic that doesn't tell the producer how to fix.** Surfaces issues but no remediation. The producer guesses.

## Trade-offs

**Pros**
- Catches errors a single pass misses.
- Encourages the producer to be more careful (it knows it'll be reviewed — though only humans really respond to this; LLMs less so, but the *system* benefits).
- Diversification: critic with different prompt finds different errors.

**Cons**
- Latency: 2x at minimum, 3-5x with revise loops.
- Cost: N+1 LLM calls per task.
- False positives waste cycles.
- The critic itself can be wrong — and confidently so.

**Rule of thumb:** Worth it for high-stakes outputs (production code, customer-facing content, decisions). Skip for ephemeral outputs.

## Real-world analogies

- Peer review of a research paper.
- Code review on a PR.
- An editor reading a draft.

## Run the demo

```bash
node demo.js
```

The demo runs a producer that drafts a JSON document and a critic that reviews it for completeness. Up to 3 revise rounds; converges or terminates.

## Deeper intuition

Multi-agent patterns are coordination strategies, not magic multipliers. They help only when splitting the work reduces cognitive load more than it increases communication overhead, synthesis work, and opportunities for contradictory conclusions.

The best way to study **Critic / Reviewer** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
