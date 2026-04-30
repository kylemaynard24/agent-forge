# Daily Learning Goals

A focused, sprint-driven plan for working through four subjects in parallel — one step task + one apply task per subject per day, plus 2 comprehension questions per subject. Cadence comes from the `daily-tasks` skill in `.claude/skills/daily-tasks/`; personal progress lives under `progress/` (gitignored — your daily work never gets pushed).

The cap is **four subjects** — chosen deliberately to keep daily load consistent. Small, consistent, incremental improvements > maximal coverage.

## The four subjects

| Subject | Master syllabus (shared) | Source / canonical material |
|---|---|---|
| Agentic workflows | [learning-syllabuses/agentic-workflows.md](learning-syllabuses/agentic-workflows.md) | `agentic-workflows/` repo content |
| Software architecture | [learning-syllabuses/architecture.md](learning-syllabuses/architecture.md) | `software-engineering/architecture/` repo content |
| Design patterns | [learning-syllabuses/design-patterns.md](learning-syllabuses/design-patterns.md) | *Head First Design Patterns* (2nd ed) — chapter by chapter; `software-engineering/design-patterns/` as secondary reference |
| DevOps (Azure-focused) | [learning-syllabuses/devops.md](learning-syllabuses/devops.md) | Microsoft Learn, Azure docs, GitHub Actions docs, Docker docs (no repo content) |

## The daily rhythm

For each subject, on each working day:

1. **Read** — orient with the inline Reading material in today's todo, then work through the linked README or chapter.
2. **Apply** — type out a small (~10–30 line) concrete piece using the day's concept; save to `progress/<today>/work/<subject>/`.
3. **Prove it** — answer 2 comprehension questions in writing in the Notes section of today's todo.

Topics span multiple days. The progression for one topic is **read → demo → implement**, then advance to the next topic in syllabus order.

## Shared vs personal — what's in git, what isn't

This repo is meant to be **shared**. Almost everything is committed — including your daily todos and sprint state, so your learning journey is preserved in git history. The only thing kept local is the per-day `working-folder/` where apply-task scratch code lives.

| Location | What's in it | Tracked by git? |
|---|---|---|
| `learning-syllabuses/` | The four master syllabuses | Yes — shared |
| `.claude/skills/daily-tasks/` | The skill | Yes — shared |
| `agentic-workflows/`, `software-engineering/` | Existing teaching content (READMEs, demos, homework) | Yes — shared |
| `progress/<subject>/state.md` | Your sprint position | Yes — committed |
| `progress/<today>/todo.md` | Generated daily plan | Yes — committed |
| `progress/<today>/working-folder/<subject>/` | Apply-task scratch code | **No — gitignored (`progress/*/working-folder/`)** |

If multiple people work in this repo, each person should fork it (or branch) so their state files don't collide. The gitignore on `working-folder/` ensures messy experiments and any local secrets in scratch code never get pushed.

## How to use

- Run `/daily-tasks` at the start of a working session — opens or creates today's folder.
- Open `progress/<today>/todo.md`, work through it, check boxes off, fill in the **Answers + explanations** section at the bottom.
- Save apply-task code to `progress/<today>/working-folder/<subject>/` (this is gitignored).
- When you finish a topic's `implement` step, advance the relevant `progress/<subject>/state.md` (or ask `/daily-tasks` to advance it for you).

## First-time setup (you or a friend on a fresh clone)

Nothing to do. Just run `/daily-tasks`. The skill bootstraps `progress/<subject>/state.md` for each subject from row 1 of its syllabus (if missing), scaffolds today's `progress/<today>/working-folder/` directories, and writes the daily todo. State files are committed; working-folder contents stay local.

## Definition of "done" for the sprint

Through all four master syllabuses end-to-end at a sustainable pace — small consistent incremental improvements every working day, no skipped homework. The four syllabuses are sized for ~12+ months at part-time pace; the goal isn't speed, it's not stopping.
