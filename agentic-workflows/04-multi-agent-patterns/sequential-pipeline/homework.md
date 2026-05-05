# Homework — Sequential Pipeline

> Build a 3- or 4-stage pipeline. Use structured artifacts. Add checkpointing.

## Exercise: Build a "code-review" pipeline

**Stages:**
1. **Diff parser** — given a branch diff, produce a structured list of changed files + hunks.
2. **Analyzer** — given the structured diff, identify potential issues (security, perf, readability).
3. **Reporter** — given the issue list, produce a human-readable report.

**Build:**
- Three stages (each can be a stub LLM, or three real `.claude/agents/<name>.md` files).
- A pipeline runner that calls them in order.
- Structured I/O between stages: each stage's output is a JSON artifact the next stage parses.

**Constraints (these enforce the pattern):**
- Each stage has a strict input schema and output schema.
- Stages cannot peek at each other's internals.
- The runner persists each stage's output to disk (`./pipeline-runs/<run-id>/stage-N.json`).
- If any stage fails, the pipeline stops cleanly and reports the failed stage.

## Stretch 1: Resume from checkpoint

Implement resume:
- The runner accepts `--resume <run-id>`.
- It checks which stages already have artifacts; skips them; starts from the first missing stage.

**Constraint:** Resuming with the same run-id is idempotent. Running twice produces the same final artifact.

## Stretch 2: Swap a stage

Add a 4th option for stage 3: `concise-reporter` (a brief summary) vs `detailed-reporter` (a long report).

Show that swapping is one CLI flag — no other stages change.

## Reflection

- Sequential vs parallel: when does serialization actually buy you something? (Hint: when the next stage genuinely depends on the previous.)
- "Stages with vague names are pipeline smell." Why? (Hint: vague names suggest fuzzy contracts; brittle inter-stage handoffs.)
- What changes when the pipeline becomes the *agent's tool*, vs when the agent IS the pipeline?

## Done when

- [ ] Three stages, structured I/O, runner script.
- [ ] Each stage's output persists; you can inspect them after a run.
- [ ] Resume from a partially-completed run works.
- [ ] You can articulate when this beats a single agent and when it doesn't.

---

## Clean Code Lens

**Principle in focus:** Single Responsibility + Stable Named Transformations

Each pipeline stage should have a name that describes the transformation it performs — not the resource it touches or the agent it calls. "Diff parser," "Analyzer," and "Reporter" are good names because each names a transformation with a clear input and output type; a stage named "Stage 2" or "Processor" names a position, not a responsibility, which is the pipeline equivalent of a function named `step2()`. When a stage name requires reading the schema to understand what it does, the name is not doing its job.

**Exercise:** Take your three pipeline stages and write a type signature for each in the form `(InputSchema) => OutputSchema` with the schema types named after what they represent (e.g., `ParsedDiff`, `IssueList`, `ReviewReport`). If any type name feels generic (`Result`, `Data`, `Output`), rename it. The named types become the inter-stage contracts — their names should make the pipeline's data flow legible without reading any stage's implementation.

**Reflection:** The homework requires stages to "not peek at each other's internals" — they communicate only through structured artifacts. What module design principle does this enforce, and why is "stages with vague names are pipeline smell" actually a symptom of this principle being violated?
