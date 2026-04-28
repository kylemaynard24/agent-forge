# Legacy Rescue and Refactoring

**Category:** Advanced engineer track

## Intent

Seams, migration moves, behavior preservation, and credible modernization.

## When to use

- you want stronger engineering judgment in legacy rescue and refactoring
- the high-level ideas make sense but the real-world execution still feels slippery
- you need repeatable habits rather than one-off heroics
- you want to practice under realistic constraints instead of reading principles passively

## What this area trains

- finding stable seams in unstable code
- moving one dependency at a time instead of declaring rewrites
- preserving behavior before improving structure
- making future change cheaper without gambling today

## Subtopics

- [01-seam-creation/](01-seam-creation/) — Create a controlled boundary where new behavior can attach safely.
- [02-strangler-pattern/](02-strangler-pattern/) — Replace old behavior incrementally while the old system keeps serving.
- [03-anti-corruption-layers/](03-anti-corruption-layers/) — Translate between old and new models so each side keeps its own language.
- [04-branch-by-abstraction/](04-branch-by-abstraction/) — Introduce a stable abstraction first, then swap implementations behind it.
- [05-dependency-untangling/](05-dependency-untangling/) — Reduce circular or hidden dependencies so change paths become visible.
- [06-safe-database-migrations/](06-safe-database-migrations/) — Change data shape without betting the release on one irreversible step.
- [07-incremental-modularization/](07-incremental-modularization/) — Carve clearer module boundaries out of an overgrown codebase.
- [08-behavior-preservation/](08-behavior-preservation/) — Protect existing behavior while cleaning internals so trust is not lost.

## What to notice as you work through it

- where knowledge is trapped in old code
- which boundary could become the first safe seam
- what must stay behaviorally identical during cleanup
- which improvements reduce future coupling the most

## Common mistakes

- using "legacy" as permission to rewrite recklessly
- mixing behavior changes with structural cleanup
- promising large migrations before proving one safe step
- ignoring rollback because the change feels like cleanup

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

These questions are meant to turn **Legacy Rescue and Refactoring** into an operational instinct. Read them like incident prompts: what are you seeing, what move should happen next, and what mistake are you trying to avoid under pressure?

### Scenario 1 — "The system is noisy, stressful, and people want to skip straight to action"

**Question:** You are in the middle of a real engineering problem and the room wants to jump ahead before the situation is legible. Is this topic the kind of move that should slow people down and sharpen the next step?

**Answer:** Usually yes.

**Explanation:** This topic matters when disciplined engineering beats improvisation. The point is not process for its own sake. The point is to reduce confusion, make the next move more informed, and avoid creating a second problem while reacting to the first.

**Why not jump first to Performance and Capacity or Security and Trust Boundaries:** adjacent skills matter, but they often work best after **Legacy Rescue and Refactoring** has made the problem clearer, safer, or more measurable.

### Scenario 2 — "A team keeps confusing activity with progress"

**Question:** An engineer says, "We're doing a lot already, so we must be handling this well." Does **Legacy Rescue and Refactoring** help test whether the team is actually making the system easier to reason about?

**Answer:** Yes.

**Explanation:** Strong operational topics give you a quality bar for action. **Legacy Rescue and Refactoring** is useful when you need to ask whether the current work is actually reducing uncertainty, restoring control, or increasing confidence instead of merely producing motion.

**Why not treat effort as evidence:** because under pressure, busy teams can still thrash. The value of **Legacy Rescue and Refactoring** is that it gives you a sharper standard for what "better" looks like.
