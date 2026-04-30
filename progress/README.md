# Progress tracking

Two layers:

## 1. Per-subject state (`<subject>/state.md`)

Long-lived. Tracks where you are in each syllabus: current section/topic, next step (read/demo/implement), and the last thing you completed. The `daily-tasks` skill reads these to know what to assign; you (or the skill, on request) update them when you finish a topic step.

Subjects:
- `agentic-workflows/`
- `architecture/`
- `design-patterns/`

## 2. Daily folders (`YYYY-MM-DD/`)

Created fresh by `/daily-tasks` each working day. Each holds a single `todo.md` with:

- A section per subject linking to the relevant files in the repo (README, demo, homework, syllabus).
- 3–6 checkbox tasks for the day, distributed across the three subjects (1–2 per subject, depending on what each subject's next step needs).
- A short "yesterday" summary pulled from the previous day's folder, so you can pick up cleanly.

Edit `todo.md` as you work — check boxes off, add notes inline. The folder is the day's record; the next day gets its own folder.
