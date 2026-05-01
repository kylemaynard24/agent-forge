# Daily Learning Goals

A focused, sustainable plan for working through four subjects in parallel — one **sprint** at a time, one **daily slice** at a time. Sprints cover ~10–15 hours of curriculum (~1–2 weeks of part-time work) across all four subjects; daily slices are 2–3 items (~1–2 hours) drawn from the active sprint. The split exists because real engineers have ~1–2 hours per day for self-directed learning, not 8.

The cap is **four subjects** — chosen deliberately to keep cognitive load consistent. Small, consistent, incremental improvements > maximal coverage.

## The four subjects

| Subject | Master syllabus (shared) | Source / canonical material |
|---|---|---|
| Agentic workflows | [learning-syllabuses/agentic-workflows.md](learning-syllabuses/agentic-workflows.md) | `agentic-workflows/` repo content |
| Software architecture | [learning-syllabuses/architecture.md](learning-syllabuses/architecture.md) | `software-engineering/architecture/` repo content |
| Design patterns | [learning-syllabuses/design-patterns.md](learning-syllabuses/design-patterns.md) | *Head First Design Patterns* (2nd ed) — chapter by chapter; `software-engineering/design-patterns/` as secondary reference |
| DevOps (Azure-focused) | [learning-syllabuses/devops.md](learning-syllabuses/devops.md) | Microsoft Learn, Azure docs, GitHub Actions docs, Docker docs (no repo content) |

## The two-skill rhythm

There are two skills that drive the loop, intentionally split:

1. **`/next-sprint`** — generates the comprehensive sprint plan covering all four subjects at their current state positions. Produces `progress/sprints/<date>/sprint.md` (the full reading material, apply tasks, questions, extra credit) and `progress/sprints/<date>/items.md` (a flat checklist of ~10–14 items). Run when starting a new sprint cycle.
2. **`/daily-tasks`** — picks 2–3 items (~1–2 hours) from the active sprint's items.md for today. Produces `progress/<today>/todo.md` with the chosen slice + brief context. Re-run the same day if you finish: it asks "did you finish today's items?" and pulls the next slice if you say yes.

For each item, the loop is the same: read or build (depending on item type), then check the box and either grab another slice or stop for the day. Sprints span ~1–2 weeks; the underlying topic progression is **read → demo → implement**, then advance to the next topic in syllabus order. Each sprint covers one topic-step for all four subjects.

## Shared vs personal — what's in git, what isn't

This repo is meant to be **shared**. Almost everything is committed — including your sprint plans, daily todos, and state — so your learning journey is preserved in git history. The only thing kept local is the per-day `working-folder/` where apply-task scratch code lives.

| Location | What's in it | Tracked by git? |
|---|---|---|
| `learning-syllabuses/` | The four master syllabuses | Yes — shared |
| `.claude/skills/next-sprint/`, `.claude/skills/daily-tasks/` | The skills | Yes — shared |
| `agentic-workflows/`, `software-engineering/` | Existing teaching content (READMEs, demos, homework) | Yes — shared |
| `progress/<subject>/state.md` | Your position in each subject's syllabus | Yes — committed |
| `progress/sprints/<date>/sprint.md` + `items.md` | Generated sprint plans | Yes — committed |
| `progress/<today>/todo.md` | Today's small slice | Yes — committed |
| `progress/<today>/working-folder/<subject>/` | Apply-task scratch code | **No — gitignored (`progress/*/working-folder/`)** |

If multiple people work in this repo, each person should fork it (or branch) so their state files don't collide. The gitignore on `working-folder/` ensures messy experiments and any local secrets in scratch code never get pushed.

## How to use

1. **Once per ~1–2 weeks:** run `/next-sprint` to generate the next sprint plan. Read the overview in `progress/sprints/<date>/sprint.md` to see what you're learning this sprint.
2. **At the start of a working session:** run `/daily-tasks` — it picks 2–3 items from the active sprint and writes today's `todo.md`.
3. **Work through today's items.** Save apply-task code to `progress/<today>/working-folder/<subject>/` (gitignored).
4. **If you finish today's items and have more time:** run `/daily-tasks` again. It asks "did you finish?" and pulls the next slice.
5. **When the whole sprint is complete** (every item in `items.md` is `[x]`): run `/next-sprint` again. It advances state by one step and generates the next sprint.

## First-time setup (you or a friend on a fresh clone)

Run `/next-sprint`. The skill bootstraps `progress/<subject>/state.md` for each subject from row 1 of its syllabus (if missing) and generates the first sprint. Then run `/daily-tasks` to start working.

## Definition of "done" for the sprint

Through all four master syllabuses end-to-end at a sustainable pace — small consistent incremental improvements every working day, no skipped homework. The four syllabuses are sized for ~12+ months at part-time pace; the goal isn't speed, it's not stopping.
