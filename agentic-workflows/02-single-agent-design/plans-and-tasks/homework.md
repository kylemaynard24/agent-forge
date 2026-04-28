# Homework — Plans and Tasks

> Add explicit planning to an agent. Track progress. Replan when reality diverges.

## Exercise 1: Build a plan-then-act agent

Take the loop from `01-foundations/the-agentic-loop`. Add a planning phase:

1. On receiving the goal, the loop's first action is **always** to call `make_plan(goal)`.
2. `make_plan` (a tool) returns a structured plan: `{ goal, steps: [{ id, action, status }] }`.
3. The agent then executes steps in order, updating status as it goes.
4. The final step calls `finish` with both the final answer and the completed plan.

**Constraints:**
- The plan is structured (a real JSON object). No free-text plan parsing.
- The plan is updated as state — done/failed/skipped statuses are real markers.
- The loop logs every step transition (`[s2: pending → done]`).
- The final answer includes the plan as an audit trail.

## Exercise 2: Add replanning

When a step fails (returns `{status: 'failed', ...}`):

1. The agent calls `replan(plan, failed_step)` (a tool).
2. `replan` returns a new plan or an updated portion. (For this exercise, you can hand-roll the replanner; in practice it's an LLM call.)
3. The loop continues with the new plan.
4. Cap replans at 3 per run; on the 4th, terminate with `reason: "stuck"`.

**Constraints:**
- Replans preserve completed steps (don't redo work).
- Replans are visible in logs — you can see *what* changed and *why*.
- If replanning produces a plan that's nearly identical to the failed one, that's a sign of a stuck agent → terminate.

## Exercise 3: Persist the plan

Combine with the memory work from earlier:
- Save the plan to a file at every status change.
- On agent restart with the same goal, **load** the plan and resume from the first non-done step.

**Constraints:**
- Persistence is atomic — a crash mid-update doesn't leave the plan in a half-written state.
- The plan file is human-readable (you can `cat` it and understand the agent's state).
- Resume works idempotently — running twice doesn't re-do completed steps.

## Stretch: Hierarchical plans

Some tasks decompose into **sub-tasks** that themselves need planning. Add support:

```
{
  goal: "Refactor auth module",
  steps: [
    { id: "s1", action: "Inventory", status: "done" },
    { id: "s2", action: "Refactor each subsystem",
      sub_plan: {
        goal: "Refactor each subsystem",
        steps: [
          { id: "s2.1", action: "JWT module", status: "done" },
          { id: "s2.2", action: "Session module", status: "pending" }
        ]
      }
    }
  ]
}
```

The agent must navigate the tree — drilling into sub-plans, completing them, ascending.

**Constraint:** depth ≤ 2 to keep the demo manageable. Document why deeper trees are usually a smell.

## Reflection

- "Plans go stale; replanning is the rule, not the exception." Can you point to a real-world example from your life where this shows up?
- A plan you don't update is just a list. What's the lightest mechanism that keeps a plan honest? (Hint: enforced status transitions; logging.)
- When does plan-then-act *cost* more than basic ReAct? (Hint: short tasks; tasks where each step rewrites the next.)

## Done when

- [ ] Your agent always plans before acting.
- [ ] Plans update in real time as steps complete or fail.
- [ ] Replanning works for at least one tested failure scenario.
- [ ] You can resume from a persisted plan after a restart.
