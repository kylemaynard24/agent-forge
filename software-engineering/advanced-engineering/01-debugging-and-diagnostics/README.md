# Debugging and Diagnostics

**Category:** Advanced engineer track

## Intent

Root-cause analysis, repro minimization, signal extraction, and disciplined search.

## When to use

- you want stronger engineering judgment in debugging and diagnostics
- the high-level ideas make sense but the real-world execution still feels slippery
- you need repeatable habits rather than one-off heroics
- you want to practice under realistic constraints instead of reading principles passively

## What this area trains

- turning vague symptoms into sharp questions
- shrinking the search space with evidence
- separating trigger, symptom, mechanism, and cause
- adding only the instrumentation that helps the next decision

## Subtopics

- [01-symptom-triage/](01-symptom-triage/) — Turn broad complaints into specific, observable failure statements.
- [02-repro-minimization/](02-repro-minimization/) — Reduce a failing case to the smallest input and environment that still fails.
- [03-binary-search-debugging/](03-binary-search-debugging/) — Cut the search space in half repeatedly instead of wandering through the codebase.
- [04-log-forensics/](04-log-forensics/) — Extract signal from noisy logs and reconstruct what actually happened.
- [05-trace-analysis/](05-trace-analysis/) — Use span timing and call trees to locate the slow or broken boundary.
- [06-state-corruption/](06-state-corruption/) — Recognize when the current bad value was created earlier than the visible failure.
- [07-concurrency-bugs/](07-concurrency-bugs/) — Reason about ordering, races, and shared state under parallel execution.
- [08-config-and-env-drift/](08-config-and-env-drift/) — Notice when code is fine but runtime configuration is lying to you.
- [09-root-cause-analysis-writing/](09-root-cause-analysis-writing/) — Write the debugging story clearly enough that others learn from it.

## What to notice as you work through it

- what the user observed versus what the system actually did
- which hypothesis would be disproven by the next observation
- where the smallest reliable reproduction lives
- whether the current evidence narrows or widens the search space

## Common mistakes

- editing code before stabilizing the reproduction
- conflating the visible symptom with the root cause
- trusting one noisy log line more than a pattern of evidence
- fixing the first plausible cause instead of the verified one

## How to use the materials

Each subtopic folder contains:

1. **README.md** — the concept and trade-offs
2. **demo.js** — a tiny runnable illustration
3. **homework.md** — a constrained exercise

Run any demo with:

```bash
node path/to/demo.js
```

Start with the earlier folders before the later ones. The ordering is intentional.

## Scenario questions

These questions are meant to turn **Debugging and Diagnostics** into an operational instinct. Read them like incident prompts: what are you seeing, what move should happen next, and what mistake are you trying to avoid under pressure?

### Scenario 1 — "The system is noisy, stressful, and people want to skip straight to action"

**Question:** You are in the middle of a real engineering problem and the room wants to jump ahead before the situation is legible. Is this topic the kind of move that should slow people down and sharpen the next step?

**Answer:** Usually yes.

**Explanation:** This topic matters when disciplined engineering beats improvisation. The point is not process for its own sake. The point is to reduce confusion, make the next move more informed, and avoid creating a second problem while reacting to the first.

**Why not jump first to Legacy Rescue and Refactoring or Incident Response and Engineering Execution:** adjacent skills matter, but they often work best after **Debugging and Diagnostics** has made the problem clearer, safer, or more measurable.

### Scenario 2 — "A team keeps confusing activity with progress"

**Question:** An engineer says, "We're doing a lot already, so we must be handling this well." Does **Debugging and Diagnostics** help test whether the team is actually making the system easier to reason about?

**Answer:** Yes.

**Explanation:** Strong operational topics give you a quality bar for action. **Debugging and Diagnostics** is useful when you need to ask whether the current work is actually reducing uncertainty, restoring control, or increasing confidence instead of merely producing motion.

**Why not treat effort as evidence:** because under pressure, busy teams can still thrash. The value of **Debugging and Diagnostics** is that it gives you a sharper standard for what "better" looks like.
