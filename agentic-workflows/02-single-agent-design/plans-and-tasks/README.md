# Plans and Tasks

**Category:** Single-agent design

## Why a separate planning step

In a basic loop, the LLM decides "what next" at every step. This works — but it leads to:

- **Wasted exploration.** The agent tries A, then B, then realizes it should have done B first.
- **Goal drift.** Many small decisions accumulate into a path the user didn't ask for.
- **Hard-to-debug runs.** No record of "what was the plan?" — only of what happened.

A **plan-then-act** pattern adds an explicit planning phase up front. The agent (or a separate planning prompt) produces a structured plan; subsequent steps execute the plan items.

## The pattern

```
1. Receive goal.
2. PLAN — emit a structured list of steps.
3. EXECUTE — for each step, call appropriate tools, update plan progress.
4. (Optional) REPLAN — if a step fails or context shifts, regenerate the remaining plan.
5. FINISH — once all steps done, submit final result.
```

The plan itself is structured data:

```json
{
  "goal": "Refactor the auth module",
  "steps": [
    { "id": "s1", "action": "list_files in src/auth/", "status": "pending" },
    { "id": "s2", "action": "Read each .py file", "status": "pending" },
    { "id": "s3", "action": "Identify legacy patterns", "status": "pending" },
    { "id": "s4", "action": "Propose refactor", "status": "pending" },
    { "id": "s5", "action": "Apply changes", "status": "pending" }
  ]
}
```

The agent maintains this plan as state and updates step statuses as it goes.

## When plan-then-act is worth it

- The task has clearly enumerable sub-steps.
- The user benefits from seeing the plan up front (collaborative tasks).
- The path is *roughly* predictable — most steps will run without surprise.
- You want auditable progress (the plan is the audit trail).

## When it's not

- The task is short (1–3 steps).
- The path depends heavily on what's discovered (a research task where each finding rewrites the next move).
- The plan would be 80% wrong by step 3 anyway.

In these cases, basic ReAct (decide-each-step) is cheaper and more responsive.

## Tasks vs plans

There's a vocabulary distinction worth getting right:

- A **plan** is the blueprint: an ordered list of intentions, often modifiable.
- A **task** is one item in the plan: a discrete unit of work with a status.
- A **task list** is the runtime state: which tasks are done, in-progress, blocked.

Tools like Claude Code's `TaskCreate`/`TaskUpdate` correspond to this — they expose the plan as inspectable state.

## The replanning problem

Plans go stale. Step 3 fails; step 4 was based on step 3 succeeding. Now what?

Options:

- **Replan from scratch.** Throw away the rest, regenerate. Clean but expensive.
- **Patch.** Modify the failing step or insert recovery steps. Surgical.
- **Continue with caveat.** Note the failure, proceed if downstream steps don't depend on it.

In practice, most agents combine these: try patching first, replan if patching fails.

## Anti-patterns

- **Plans without progress tracking.** A plan you don't update is just a comment.
- **Plans that mirror the agent's tools.** A 5-step plan where each step is "call tool X" — you're just spelling out the loop. The plan should be more abstract than the execution.
- **Plans the user never sees.** Half the value of plans is human-in-the-loop visibility. Make them visible.
- **Plans that lock the agent.** If the agent can't deviate when it discovers something new, replanning is broken — and the plan becomes a cage.

## Hybrid: lightweight plans

A common middle ground: the agent produces a *short* high-level plan (3–6 items, intent-level not action-level), then executes within that scope. Allows freedom of tactics; constrains overall direction.

```
Plan:
1. Inventory the auth code (what's there).
2. Spot legacy patterns (what's wrong).
3. Propose changes (what to do).
4. Apply (do it).

Within each step, use whatever tools you need.
```

## Plans across sessions

For long-running tasks, the plan IS the memory. It survives across context-window resets. Pair plan-then-act with file-backed memory (see previous topic): persist the plan, reload it, resume.

This is the foundation of agents that work for hours/days — they don't fit in one context window, but the plan does.

## Trade-offs

**Pros**
- Auditable: you can see what the agent was trying to do.
- Recoverable: the plan survives failures and context resets.
- User-friendly: humans can read the plan, approve, edit.
- Reduces drift: the agent's later steps are anchored to the plan.

**Cons**
- Cost: planning is an extra LLM call.
- Brittleness: a stale plan can lead the agent astray.
- Up-front commitment: the agent commits to a path before knowing everything.

**Rule of thumb:** Use plan-then-act for tasks the user would benefit from seeing planned. Use basic ReAct for short, exploratory tasks.

## Real-world analogies

- A surgical plan: pre-op briefing, intra-op execution, post-op review. Plans go stale during surgery; experienced surgeons replan smoothly.
- A grocery list. Without it, you buy 30% the wrong things and forget 30% of what you needed.
- An issue tracker: tasks with statuses; the plan is implicit in priorities.

## Run the demo

```bash
node demo.js
```

The demo implements plan-then-act over a 5-step refactor task: planner produces a plan, executor runs each step, status updates, replanning when a step "fails."
