# Daily Learning Goals

A focused, sprint-driven plan for working through three subjects in parallel — one task per subject per day. Cadence comes from the `daily-tasks` skill in `.claude/skills/daily-tasks/`; progress is tracked under `progress/`.

## The three subjects

| Subject | Source path | Syllabus |
|---|---|---|
| Agentic workflows | `agentic-workflows/` | `agentic-workflows/SYLLABUS.md` |
| Software architecture | `software-engineering/architecture/` | `software-engineering/SYLLABUS.md` (Stage 2+) |
| Design patterns | `software-engineering/design-patterns/` | `software-engineering/SYLLABUS.md` (Stage 1) |

## The daily rhythm

For each subject, on each working day, one of these three task types:

1. **Read** — work through the topic's `README.md` and take notes.
2. **Demo** — run, modify, and reason about the topic's `demo.js` (or equivalent).
3. **Implement** — do the topic's `homework.md` (or a self-defined exercise) in `_solutions/`.

The progression for one topic is always **Read → Demo → Implement**, then advance to the next topic in syllabus order. Don't skip ahead, don't bend constraints in the homework — they exist on purpose.

## The progress system

Two layers under `progress/`:

- `<subject>/state.md` — long-lived: current topic, current step (read / demo / implement), last completed.
- `YYYY-MM-DD/todo.md` — one folder per working day. Holds a single todo file with linked file paths for each subject and 3–6 checkbox tasks (1–2 per subject) for that day, plus a short summary of yesterday.

The `daily-tasks` skill reads each `state.md`, looks at the most recent prior dated folder for yesterday's context, and writes today's `progress/YYYY-MM-DD/todo.md`. It does not overwrite an existing day's todo.

## How to use

- Run `/daily-tasks` at the start of a working session — opens or creates today's folder.
- Open `progress/<today>/todo.md`, work through it, check boxes off, jot notes inline.
- When you finish the third step (implement) for a topic, advance the relevant `state.md` to the next topic in the syllabus (or ask `/daily-tasks` to advance it for you).

## Definition of "done" for the sprint

Through the agentic-workflows syllabus (6 months / 32 topics) and the design-patterns + architecture portions of the engineering syllabus (12 months / ~50 topics) at a sustainable pace — one substantive task per subject per day, no skipped homework.
