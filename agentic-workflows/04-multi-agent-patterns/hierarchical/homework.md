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
