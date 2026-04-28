# Hierarchical

**Category:** Multi-agent patterns

## The pattern

An agent at the top decomposes work into chunks. Each chunk goes to a **manager** agent that further decomposes into sub-tasks. Sub-tasks go to **worker** agents. Results flow back up the tree.

```
                          [CEO]
                            │
                  ┌─────────┼──────────┐
                  ▼         ▼          ▼
              [Mgr A]   [Mgr B]    [Mgr C]
                 │         │          │
              ┌──┴──┐   ┌──┴──┐    ┌──┴──┐
              ▼     ▼   ▼     ▼    ▼     ▼
            [W][W]   [W][W]    [W][W]
```

Hierarchical is **orchestrator-worker recursive**: each manager is itself an orchestrator for its workers.

## When to use

- The task is too big for one orchestrator's context.
- The decomposition is naturally tree-shaped (a project → modules → tasks).
- Mid-level managers have meaningful synthesis to do (not just pass-through).

Examples:
- A research project: top agent identifies sub-topics; each sub-topic agent runs its own research; results aggregate up.
- A code-base refactor: top decomposes by module; each module-manager decomposes by file; each file is reviewed by a worker.

## When NOT to

- Two-level orchestrator-worker is enough (you're not actually deep enough to need a hierarchy).
- The cost is genuinely too high (every level multiplies LLM calls).
- The decomposition is forced — you're inventing levels because you have hierarchical hammers.

## Trade-offs

**Pros**
- Scales beyond a single context window — each level handles its own slice.
- Natural for tree-decomposable tasks.
- Each level is an opportunity for synthesis (managers don't just pass through).

**Cons**
- Cost multiplies with depth. A 3-level hierarchy with 5 children per level = 30+ LLM calls.
- Coordination is harder than 2-level orchestrator-worker.
- The deeper you go, the more chance of context-loss between levels.

**Rule of thumb:** Avoid going deeper than 2-3 levels. If you need more, you've probably got the wrong shape.

## What managers should NOT be

A manager that just passes the brief from CEO to workers, then concatenates worker outputs, is dead weight. Either:
- Add real synthesis at the manager level (manager LLM-summarizes worker reports), OR
- Drop the level entirely.

## Real-world analogies

- A consulting firm: partner → manager → analyst. Each level adds synthesis, not just delegation.
- A military command structure: general → colonel → captain → soldier.
- An editor → section editor → reporter chain at a magazine.

## Run the demo

```bash
node demo.js
```

The demo runs a 3-level hierarchical agent: top agent decomposes a "research a topic" task into 2 sub-topics; each sub-topic manager decomposes into 3 angles; each angle is researched by a worker. Results aggregate up.
