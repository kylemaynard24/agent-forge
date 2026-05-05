# Homework — Orchestrator-Worker

> Build a small orchestrator. Brief the workers like smart colleagues. Synthesize their outputs.

## Exercise: Build an "interview-preparation" orchestrator

**Scenario:** Given a job description, three specialist agents prepare:
1. A `requirements-extractor` agent — pulls the must-haves from the JD.
2. A `gap-analyzer` agent — given a candidate's resume, identifies gaps vs the JD.
3. A `question-generator` agent — given the JD, drafts likely interview questions.

The orchestrator runs all three in parallel and synthesizes a "prep packet."

**Build:**
- Three agents (real `.claude/agents/<name>.md` files OR three stub-LLM functions).
- An orchestrator (a slash command OR a Node script with stub workers).
- Each worker has a tight system prompt and structured output.
- The orchestrator synthesizes into a single packet.

**Constraints (these enforce the pattern):**
- Workers run in parallel (one message with multiple Agent calls, OR `Promise.all`).
- Each worker is briefed self-contained — it doesn't see the others.
- Each worker returns structured JSON.
- The orchestrator's synthesis is itself an LLM call (or, in stub mode, a deterministic merge with sensible behavior).

## Stretch 1: Compare parallel vs serial

Run the orchestrator twice — once with parallel workers, once serial. Measure wall-clock time. Confirm the math: parallel ≈ max(latency); serial ≈ sum.

## Stretch 2: Add a critic worker

After the three workers return, spawn a 4th — a `critic` agent — whose job is to review the synthesis for completeness. If it flags an issue, the orchestrator can re-run with refined briefs.

This previews `critic-reviewer` (next topic).

## Reflection

- "An orchestrator is only as good as how it briefs workers." Argue this. (Hint: workers can't see the orchestrator's context.)
- When should the orchestrator be one of the workers (so the same model both delegates and does work)? (Hint: when the work is so small that decomposition overhead dominates.)
- "Many short workers, one long orchestrator." Why is this often the right shape? (Hint: orchestrator owns the synthesis context; workers' contexts are throwaway.)

## Done when

- [ ] Three workers run in parallel.
- [ ] Each is briefed self-contained.
- [ ] The orchestrator synthesizes a structured final output.
- [ ] You can articulate when this pattern wins vs. when it's overkill.

---

## Clean Code Lens

**Principle in focus:** Single Responsibility + Separation of Concerns

The orchestrator's job is coordination — it briefs workers, collects their outputs, and synthesizes a result. The moment the orchestrator also contains the logic for extracting requirements, or scoring gaps, or generating questions, it has two responsibilities: it is simultaneously a coordinator and a domain expert. That is the same violation as a controller class that contains business logic: each responsibility has a different reason to change, and bundling them makes both harder to test and maintain independently.

**Exercise:** Audit your orchestrator's synthesis step. If the synthesis prompt contains any logic that "belongs" to one of the workers (e.g., it re-interprets the gap-analyzer output rather than trusting its structured result), extract that logic back into the worker's system prompt. The orchestrator's synthesis should be purely combinatorial — merging well-structured outputs, not re-doing domain work.

**Reflection:** The homework requires workers to be briefed "self-contained" — they cannot see each other or the orchestrator's context. What clean code principle does this enforce, and what would go wrong in a codebase if modules could access each other's private state in the same way an orchestrator-aware worker could?
