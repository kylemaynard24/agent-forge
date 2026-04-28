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
