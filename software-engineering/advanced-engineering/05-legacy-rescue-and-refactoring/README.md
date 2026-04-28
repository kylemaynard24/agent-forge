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
