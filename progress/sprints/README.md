# Sprints

Each subdirectory here is one sprint, named by the date it was generated (`YYYY-MM-DD/`). A sprint covers one step (`read`, `demo`, or `implement`) for each of the four tracked subjects at their current state position, broken into ~10–14 discrete items totaling ~10–15 hours of work. A sprint takes roughly 1–2 weeks at part-time pace.

## Per-sprint files

- `sprint.md` — the comprehensive plan: per-subject reading material (primer, key concepts, watch-for, deep dive, excerpt), apply tasks, prove-it questions with model answers + how-to-approach explanations, extra credit (papers/talks), and C# extra credit pointers.
- `items.md` — a flat checklist of the discrete items in this sprint. State per item: `[ ]` not started, `[~]` in progress (pulled into a daily todo), `[x]` complete. Read by the `/daily-tasks` skill to pick today's slice and updated as items finish.

## How sprints fit with daily tasks

```
/next-sprint  → generates a new sprint from current state.md positions
                → produces sprints/YYYY-MM-DD/sprint.md and items.md
                → does NOT advance state (state advances only on the NEXT call,
                  if the previous sprint is fully complete)

/daily-tasks  → finds the most recent sprint with unchecked items
              → picks 2–3 items (~1–2 hours of work) for today
              → produces progress/<today>/todo.md (the slice)
              → on re-run same day: asks "did you finish?" — if yes, pulls more
```

When a sprint completes, the next `/next-sprint` invocation advances each subject's state by one step (`read` → `demo` → `implement`, or `implement` → next topic) and generates the next sprint.

## Why sprints stay in git

Each completed sprint is a record of what you worked through — useful for retrospectives ("what did I cover in March?") and for sharing the repo with friends so they can see the structure. The dated folders accumulate as a learning history.

The `working-folder/` inside each daily date folder is still gitignored — only sprint plans, daily todos, and state files are committed.
