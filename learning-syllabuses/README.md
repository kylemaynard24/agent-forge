# Learning syllabuses

Shared, version-controlled curriculum for the four subjects driven by the `daily-tasks` skill in `.claude/skills/daily-tasks/`.

| Subject | Syllabus | Source / canonical material |
|---|---|---|
| Agentic workflows | [agentic-workflows.md](agentic-workflows.md) | `agentic-workflows/` repo content |
| Software architecture | [architecture.md](architecture.md) | `software-engineering/architecture/` repo content |
| Design patterns | [design-patterns.md](design-patterns.md) | *Head First Design Patterns* (2nd ed) — chapter by chapter; `software-engineering/design-patterns/` as secondary reference |
| DevOps (Azure shop) | [devops.md](devops.md) | Microsoft Learn, Azure docs, GitHub Actions docs, Docker docs (no repo content) |

Each syllabus has 4 levels (Beginner → Expert) with topics that link to repo content (where available) and external canonical resources. Topics span multiple days; the daily skill paces you through them.

## How the system works

This repo is meant to be **shared**. Almost everything is committed — the syllabuses (here), the skill, `goals.md`, the existing teaching content, AND your sprint state + daily todos under `progress/`. The only thing kept local is each day's `progress/<date>/working-folder/` (gitignored via `progress/*/working-folder/`), where apply-task scratch code lives.

That split lets your learning journey stay in git history (every daily todo, every level you advanced, every comprehension answer you wrote) while messy experiments and local secrets in scratch code stay off the network.

When you (or a friend) clone the repo and run `/daily-tasks` for the first time, the skill auto-bootstraps any missing `progress/<subject>/state.md` files starting at Level 1 row 1, then writes today's plan to `progress/<today>/todo.md` and scaffolds `progress/<today>/working-folder/<subject>/` for your apply work.

## How to use

1. Read [goals.md](../goals.md) at the repo root for the rhythm.
2. Run `/daily-tasks` at the start of each working session — it reads these syllabuses + your personal `progress/<subject>/state.md` and produces today's plan.
3. Work the plan: read, apply, answer the comprehension questions in Notes.
4. When you finish a topic's `implement` step, advance the matching `progress/<subject>/state.md` (or ask the skill to do it).

## Adding or modifying a syllabus

These syllabuses are intentionally opinionated but not fixed. If a topic's order or framing isn't working for you, edit the syllabus directly — `state.md` references topics by index, so reordering will shift what's "next." Adjust deliberately.

To add a wholly new subject, see "Bootstrapping a new tracked subject" in `.claude/skills/daily-tasks/SKILL.md`.
