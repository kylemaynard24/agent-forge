# Plans and plan mode

A **plan** in Claude Code is the output of a research-then-propose cycle: Claude reads the relevant code, figures out what needs to change, and presents a step-by-step proposal *before* it writes anything. You approve, and only then does implementation start.

## Why plan mode exists

The default loop — "ask, Claude edits" — works for small tasks. For anything non-trivial, you want:

- A chance to correct the approach before code gets written
- Confidence that Claude actually understood the repo
- A shared artifact (the plan) that you can edit, save, or paste into a PR description

Plan mode enforces this. While in plan mode, Claude **cannot edit files or run state-changing commands**. It can only read, search, and think.

## How to enter plan mode

Three ways:

1. **`Shift+Tab`** cycles through permission modes — one of them is plan mode. Cheapest and most common.
2. **Ask for a plan:** "Plan this before touching code." Claude will use its plan tooling even without the mode toggle.
3. **Delegate to a planning agent:** use the built-in `Plan` subagent for deeper architectural proposals.

While in plan mode you'll see a banner. Exit with `Shift+Tab` again, or Claude will exit automatically when you approve the plan (via `ExitPlanMode`).

## What a good plan looks like

Claude's plans are most useful when they contain:

- **A restatement of the goal** — proves it understood the task
- **Files to touch** with specific paths and what changes in each
- **Order of operations** — what has to happen before what
- **Tradeoffs considered** — the alternatives that were weighed
- **Tests or verification** — how you'll know it worked
- **Open questions** — anything ambiguous that needs your call

If the plan is vague ("update the auth module"), push back. Ask: "Which files? Which functions? What's the data flow change?" Plan mode is cheap; iterating on a plan is cheaper than iterating on code.

## Writing prompts that produce good plans

Bad: *"Plan the auth refactor."*
Good:

> Plan the auth refactor. Context: we're migrating from cookie-based sessions to signed JWTs because legal flagged the session-token storage. I care most about:
> - A clean rollout path (no flag-day for existing sessions)
> - Keeping `@require_auth` decorator signature unchanged
> - A test covering mixed cookie+JWT traffic during the transition
>
> Identify the files that change, the migration order, and the rollout plan. Flag anything I haven't thought of.

The model produces what you specify. Name the constraint, the success criteria, and the stuff you're worried about.

## Plan → implementation handoff

When you approve a plan, Claude implements it in the same session. Two things help:

1. **Break the plan into reviewable chunks.** Ask for "phase 1 only" if it's big. You'll catch drift sooner.
2. **Keep the plan visible.** Scroll back to it, or copy it into a scratch file. If Claude drifts mid-implementation, paste it back and say "stick to this plan."

## Plans are also documents

A good plan is reusable. Paste it into:

- A GitHub issue — lets a teammate take over
- A PR description — gives reviewers the "why"
- Your project's `docs/decisions/` folder — frozen record of a tradeoff

Plan mode is as much about producing a document as it is about safety.

## Plan mode vs. the `Plan` agent

- **Plan mode** is a *permission mode* on the main session — Claude can't edit while it's on.
- **The `Plan` agent** is a *subagent* you can delegate to: *"Have the Plan agent design an approach for X."* It returns a written plan but doesn't implement.

Use plan mode when *you* want to stay driving. Use the Plan agent when you want an independent proposal you can compare against your own thinking.

## Where to go next

- Fanning out the research step across several agents → [panels.md](panels.md)
- Turning a recurring plan template into a command → [slash-commands.md](slash-commands.md)
