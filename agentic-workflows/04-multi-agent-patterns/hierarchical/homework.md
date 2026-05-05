# Homework — Hierarchical

> Build a 3-level hierarchy. Justify every level.

## Exercise: Hierarchical research agent

**Scenario:** Given a topic, the agent produces a multi-perspective research brief. Decomposition:
- Top level: split topic into 2-3 perspectives (technical, business, social, etc.).
- Mid level: each perspective is decomposed into 3-4 angles.
- Worker level: each angle is researched.

**Build:**
- A `topAgent` that calls 2-3 `managerAgent`s in parallel.
- Each `managerAgent` calls 3-4 `workerAgent`s in parallel.
- Each level synthesizes its children's results — managers DON'T just concatenate.
- Top produces a final brief.

**Constraints (these enforce the pattern):**
- Each manager LLM-summarizes its workers' outputs (no pass-through).
- Each level uses parallel Promise.all (or one-message multi-Agent).
- Total LLM calls is bounded — log them.
- The output is structured: `{ topic, perspectives: [{ name, angles: [...], synthesis }], top_synthesis }`.

## Stretch 1: Cost guard

Add a budget cap (max LLM calls). If the planned hierarchy would exceed it, prune (drop a perspective or angle) BEFORE running.

## Stretch 2: Failure isolation

What if one worker fails? Two failure modes:
- Crash the whole hierarchy.
- Skip the failed angle; manager synthesizes from the remaining workers.

Implement the second. Document the cost: which information is lost.

## Reflection

- "A manager that doesn't synthesize is dead weight." Why? (Hint: it's just renaming the orchestrator-worker pattern with extra latency.)
- 2 levels often suffice. When does the third level genuinely buy you something?
- A 3-level hierarchy with 4 children per level = 21 LLM calls. When is that worth it; when is it absurd?

## Done when

- [ ] Three real levels with synthesis at each.
- [ ] Failure of one worker doesn't kill the run.
- [ ] You can defend the existence of the middle level — explain what it adds.
- [ ] You've counted total LLM calls and decided whether the cost was justified.

---

## Clean Code Lens

**Principle in focus:** Single Responsibility per Layer + Explicit Authority Boundaries

In a hierarchy, each level must have a one-sentence description of its authority that could not describe any other level. If the top agent's authority statement and the manager agent's authority statement could be swapped without breaking anything, the hierarchy has no real structure — it is just repeated delegation with extra latency. The clean code equivalent is a layered architecture where each layer has a named responsibility and the rule "layer N does not skip to layer N+2" is enforced by the design, not convention.

**Exercise:** Write a one-sentence authority statement for each of your three levels beginning with "This agent is responsible for..." — the statement must name what the level owns, what it synthesises, and what it does not do. Then verify the statements are non-overlapping: no two levels should be able to claim the same sentence.

**Reflection:** The homework warns that a manager that doesn't synthesise is "dead weight" — it just passes through. In software architecture, what is the equivalent layer that adds overhead without adding value — and what is the test for whether a given layer is synthesising or merely routing?
