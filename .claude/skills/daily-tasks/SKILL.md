---
name: daily-tasks
description: Use when the user wants their daily learning tasks for the three tracked subjects (agentic workflows, software architecture, design patterns). Reads each subject's master syllabus + state, finds yesterday's folder, and creates progress/YYYY-MM-DD/todo.md with 3-6 linked tasks for today.
---

This skill produces one file per working day: `progress/YYYY-MM-DD/todo.md`. The file links to the relevant repo (or external) resources for each of three subjects and lists 3–6 checkbox tasks distributed across them (1–2 per subject).

## Subjects, syllabuses, and state

Each subject has BOTH a master syllabus AND a state file:

| Key | Master syllabus | State file |
|---|---|---|
| agentic-workflows | `progress/agentic-workflows/SYLLABUS.md` | `progress/agentic-workflows/state.md` |
| architecture | `progress/architecture/SYLLABUS.md` | `progress/architecture/state.md` |
| design-patterns | `progress/design-patterns/SYLLABUS.md` | `progress/design-patterns/state.md` |

The **master syllabus** is the source of truth for topic order and what counts as a topic. Each syllabus has 4 levels (Beginner → Intermediate → Advanced → Expert), each level has a numbered topic table, and each topic row has a path (or "external" label).

The **state file** tracks the user's position as `(Level, Topic index in level, Next step)`. The skill reads state to know what's next; the skill never advances state automatically (the user does, or asks).

## Run order

Today's date is in the system context as `currentDate`. Use ISO `YYYY-MM-DD`.

### 1. Idempotency check

If `progress/<today>/todo.md` already exists, do NOT regenerate. Read it and show it to the user with a note that today's plan is already set. Stop.

### 2. Load syllabus and state for each subject

In parallel, Read all three syllabuses and all three state files.

For each subject, resolve the current topic:
- From state: `Level`, `Topic index in level`, `Next step`.
- From the syllabus, find the level's topic table and pick row number `Topic index in level`.
- Extract: topic name, topic path (or external marker), and any deliverable description.

If state's `Topic path` and the syllabus row's path disagree, trust the syllabus (state may be stale) and note the correction in the todo. If the index exceeds the level's topic count, the user has finished the level — flag it loudly and ask whether to advance to the next level.

### 3. Verify topic files (skip for external topics)

If the topic row's path starts with `agentic-workflows/` or `software-engineering/`, it's a repo topic — verify:
- step `read` → `README.md` exists in the topic dir
- step `demo` → at least one `demo.*` file exists
- step `implement` → `homework.md` exists

If a needed file is missing, fall back to the next available step in `read → demo → implement`. If the topic dir itself doesn't exist, surface this as a blocker and ask what to do (typo? skip topic? create stub?) — don't silently invent tasks.

If the row says "external" (no repo path) — skip file verification. The implement step uses the deliverable text from the syllabus row directly, and `read`/`demo` are not applicable for these topics.

### 4. Find yesterday's folder

List `progress/` for entries matching `YYYY-MM-DD`. Pick the most recent strictly before today. If found, Read its `todo.md` and capture: which boxes were checked, any inline notes, what was left unchecked. This becomes the "Yesterday" section.

If none exists, the "Yesterday" section is "Sprint starting — no prior day."

### 5. Decide task count per subject

You produce 3–6 tasks total. Distribute roughly evenly:
- Default: 1 task per subject (3 total) — the safe choice.
- Bump a subject to 2 tasks when the work for the day naturally splits:
  - step `read` AND the README is long (>150 lines) → "read first half + capture early takeaways" + "read second half + finalize takeaways"
  - step `implement` AND the homework has many "Done when" checkboxes → "complete checkboxes 1–N" + "retrospective"
  - external implement step that's multi-day → "advance the deliverable: <concrete sub-goal>" + "checkpoint note in `_solutions/external/<topic>.md`"
- Never exceed 2 tasks per subject. Cap total at 6.

### 6. Write `progress/<today>/todo.md`

Use Write (the file must not exist; step 1 guaranteed that). Template:

```markdown
# YYYY-MM-DD — Daily todo

## Yesterday (YYYY-MM-DD)

<one short paragraph summarizing checked boxes + any inline notes from the prior day's todo.md, OR "Sprint starting — no prior day.">

---

## Agentic workflows — Level <N> (<level name>)

**Topic:** `<topic>` (#<index> in level) — step: `<read|demo|implement>`

**Files:**
- Master syllabus: [progress/agentic-workflows/SYLLABUS.md](../agentic-workflows/SYLLABUS.md)
- README: [<path>/README.md](../../<path>/README.md)
- Demo: [<path>/<demo file>](../../<path>/<demo file>)
- Homework: [<path>/homework.md](../../<path>/homework.md)
- Section syllabus: [agentic-workflows/SYLLABUS.md](../../agentic-workflows/SYLLABUS.md)

**Tasks:**
- [ ] <task 1, one short sentence — concrete output expected>
- [ ] <task 2 if applicable>

---

## Software architecture — Level <N> (<level name>)

**Topic:** `<topic>` (#<index> in level) — step: `<read|demo|implement>`

**Files:**
- Master syllabus: [progress/architecture/SYLLABUS.md](../architecture/SYLLABUS.md)
- README: [<path>/README.md](../../<path>/README.md)
- Demo: [<path>/<demo file>](../../<path>/<demo file>)
- Homework: [<path>/homework.md](../../<path>/homework.md)
- Section syllabus: [software-engineering/SYLLABUS.md](../../software-engineering/SYLLABUS.md)

**Tasks:**
- [ ] <task 1>
- [ ] <task 2 if applicable>

---

## Design patterns — Level <N> (<level name>)

**Topic:** `<topic>` (#<index> in level) — step: `<read|demo|implement>`

**Files:**
- Master syllabus: [progress/design-patterns/SYLLABUS.md](../design-patterns/SYLLABUS.md)
- README: [<path>/README.md](../../<path>/README.md)
- Demo: [<path>/<demo file>](../../<path>/<demo file>)
- Homework: [<path>/homework.md](../../<path>/homework.md)
- Family overview: [<path-family>/README.md](../../<path-family>/README.md)

**Tasks:**
- [ ] <task 1>
- [ ] <task 2 if applicable>

---

## Notes

_(Free space — jot insights, blockers, things to revisit)_
```

Important details:

- All file links are RELATIVE FROM `progress/YYYY-MM-DD/`. Master-syllabus links use `../<subject>/SYLLABUS.md`; repo-content links use `../../<path>`.
- Only include link lines for files that actually exist. Drop missing ones rather than producing dead links.
- For external topics: drop the README/Demo/Homework lines and replace with a `Resource:` line quoting the syllabus's deliverable text. The single task IS the deliverable (or a sub-goal of it for multi-day work).
- Tasks must reference a concrete output. Vague tasks ("study X") are not allowed.

Phrasing template by step:
- **read**: "Read `<topic>/README.md` and capture 3–5 takeaways + one trade-off in the Notes section."
- **demo**: "Run `<demo file>`. Predict output before re-running. Modify one thing, note what it taught you."
- **implement**: "Do `<topic>/homework.md` — save to `_solutions/<...>/<topic>/`. Hit every Done-when checkbox. Write a one-paragraph retro."
- **external implement**: use the syllabus deliverable verbatim (or a sub-goal of it).

### 7. Report to the user

Show:
- Path to the new file (`progress/YYYY-MM-DD/todo.md`).
- For each subject: level + topic + step (one line).
- Total task count.
- One-line reminder: check boxes off as you go; advance `state.md` when a topic's `implement` is done (or ask this skill to do it).

## Advancing state

This skill does NOT auto-advance `state.md`. The user advances it (or asks). When asked to advance a subject:

- Within a topic: bump `Next step`: `read` → `demo` → `implement`.
- After `implement` is done:
  - If there's a next topic in the same level: increment `Topic index in level` by 1, reset `Next step` to `read`, look up the new topic name + path from the master syllabus and update `Topic` / `Topic path`. Update `Last completed` to the just-finished topic + date.
  - If that was the last topic in the level: bump `Level` by 1, reset `Topic index in level` to 1, fetch the first topic of the new level.
  - If that was Level 4 step 8 (or equivalent final row): congratulate, mark the subject "syllabus complete," and ask whether to start a new sprint with the same syllabus refreshed or pick external goals.

When advancing, ALWAYS re-read the master syllabus to pull the next topic — don't infer from memory.

## What this skill does NOT do

- Doesn't grade homework or check correctness.
- Doesn't skip ahead or reorder topics — syllabus order is the point.
- Doesn't exceed 6 tasks per day or 2 tasks per subject.
- Doesn't overwrite an existing `progress/<today>/todo.md` — that day's plan is locked once written.
- Doesn't auto-advance state — the user owns that decision.
