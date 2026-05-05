# Homework — Design Intent and Project Docs

> Choose the right engineering document, make design intent explicit, and write project docs people can actually use.

## Exercise

Pick a medium-sized system change such as introducing a job queue, splitting a background worker, adding multi-tenant access rules, or migrating a core API.

**Build:**
- one short DI document for the change
- one ADR for a high-impact decision inside that design
- one execution plan with milestones, dependencies, and rollout notes

**Constraints:**
- the DI doc must include goals, non-goals, constraints, and alternatives considered
- the ADR must capture a real trade-off rather than a foregone conclusion
- the execution plan must mention rollback or fallback, not just happy-path delivery
- each document must be readable by an engineer who missed the meetings

## Reflection

- Which part of the intended design was hardest to explain clearly?
- Where did the document improve your thinking rather than just record it?
- Which detail belonged in a different artifact than you first expected?

## Done when

- you can explain why the DI doc, ADR, and execution plan are separate artifacts
- the trade-offs are visible without extra verbal explanation
- another engineer could pick up the project direction from the docs alone

---

## Clean Code Lens

**Principle in focus:** Explicit constraints + decisions that age honestly

Design documents that name constraints explicitly — "we chose this because X, and we would revisit if Y" — age better than documents that only describe the solution, because the constraint tells future engineers when the decision is no longer valid. A design doc that records only the solution is like code without comments at a decision point: it tells you what was done but not why, so you cannot tell whether it is still the right choice.

**Exercise:** Review your DI document and find every design choice. For each one, add a one-sentence note that states the constraint that made this the right choice and a one-sentence note about what condition would make you revisit it. If you cannot write those sentences, the design rationale was not fully captured.

**Reflection:** If a condition that drove one of your design decisions changed tomorrow, would a new engineer reading your document be able to identify which decision to revisit — or would they have to re-derive the entire design to find the load-bearing assumption?
