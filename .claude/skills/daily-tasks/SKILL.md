---
name: daily-tasks
description: Use when the user wants their daily learning tasks for the three tracked subjects (agentic workflows, software architecture, design patterns). Reads each subject's master syllabus + state, finds yesterday's folder, and creates progress/YYYY-MM-DD/todo.md with 6 linked tasks (one read/demo/implement task + one apply task per subject) plus comprehension questions per subject.
---

This skill produces one file per working day: `progress/YYYY-MM-DD/todo.md`. Each day's file has, per subject, **one step task + one apply task + 2–3 comprehension questions** so the day always ends with you having read something, typed something, and proven you understood it.

## Subjects, syllabuses, and state

| Key | Master syllabus | State file |
|---|---|---|
| agentic-workflows | `progress/agentic-workflows/SYLLABUS.md` | `progress/agentic-workflows/state.md` |
| architecture | `progress/architecture/SYLLABUS.md` | `progress/architecture/state.md` |
| design-patterns | `progress/design-patterns/SYLLABUS.md` | `progress/design-patterns/state.md` |

Each syllabus has 4 levels (Beginner → Expert). For agentic-workflows and architecture, a **topic** is a single repo subdirectory. For **design-patterns**, a topic is a **Head First Design Patterns chapter** that may cover one or two patterns and typically spans **4–7 working days**.

State files track `(Level, Topic index in level, Next step)`. Topics span multiple days — the skill keeps producing same-step tasks until the user advances state.

## Run order

Today's date is `currentDate` from system context. Use ISO `YYYY-MM-DD`.

### 1. Idempotency check

If `progress/<today>/todo.md` already exists, do NOT regenerate. Read it and show it to the user with a note that today's plan is already set. Stop.

### 2. Load syllabus + state for each subject

In parallel, Read all three syllabuses and all three state files. For each subject, resolve the current topic from state's `(Level, Topic index)` against the syllabus level table. Extract: topic name, repo path(s), running example (design-patterns only), step.

If state's path disagrees with the syllabus, trust the syllabus and note the correction in the todo. If the index exceeds the level's topic count, flag it loudly and ask the user to advance the level.

### 3. Verify topic files (skip for external topics)

For repo paths starting with `agentic-workflows/` or `software-engineering/`:
- step `read` → README.md exists
- step `demo` → at least one `demo.*` file exists
- step `implement` → `homework.md` exists

For design-patterns chapters that link to multiple repo dirs (Ch 4, 7, 9), verify each. If a needed file is missing, fall back to the next available step. If the topic dir doesn't exist, surface as a blocker.

For external topics: skip file verification. The implement step uses the syllabus deliverable text directly.

### 4. Find yesterday's folder

List `progress/` for entries matching `YYYY-MM-DD`. Pick the most recent strictly before today. If found, Read its `todo.md` and capture: which boxes were checked, any inline notes, what was left unchecked, and which subjects' comprehension questions got answers. Yesterday's section paraphrases this in one short paragraph.

If none, "Sprint starting — no prior day."

### 5. Generate today's per-subject content

For each subject, decide:

**Today's step task** (matches `Next step`):
- **read**: "Continue reading `<topic>/README.md` (or Head First Ch N) for ~30–60 minutes. Capture 3–5 takeaways in Notes. If you finish the read, advance the step before tomorrow's run."
- **demo**: "Type out `<demo file>` yourself (don't paste). Run it, predict output, modify one thing, note what broke or surprised you."
- **implement**: "Do `<topic>/homework.md` (or chapter exercises). Hit each Done-when checkbox. Write a one-paragraph retro."

**Today's apply task** (the "physically type and build" piece):
- A small, concrete coding exercise (~10–30 lines) that uses the day's concept in a different setting from the README/demo. Examples:
  - `read` day on Strategy: "Type a 15-line example where a `Sorter` class has a swappable `compare` strategy. Run it with two different strategies."
  - `read` day on Observer: "Type a 20-line `EventBus` with subscribe/emit. Subscribe two listeners, emit one event, see both fire."
  - `read` day on `separation-of-concerns`: "Take any 30-line script you've written that mixes I/O and logic. Split it into a pure function + a thin I/O wrapper. Save both files."
  - `read` day on `what-is-an-agent`: "Sketch (in code or pseudocode) the four-piece anatomy of an agent that reads a file and returns its line count: LLM call placeholder, one tool, the loop, a goal."
- The apply task must reference a concrete output: a file path, a line count, an expected behavior. No vague "explore" tasks.
- Save apply work to `<subject>_solutions/applied/<topic>/<YYYY-MM-DD>.<ext>` so it accumulates over time.

**Comprehension questions** (2–3 per subject, answered in writing in the Notes section of the todo):
- The skill must read enough of the topic's README (or know the chapter's content) to GENERATE questions specific to today's reading. Avoid generic questions like "what did you learn?"
- Question shapes that work well:
  - "In your own words, what problem does X solve that Y doesn't?"
  - "Name a place in code you've written where X is hiding under a different name (e.g., 'policy', 'handler', 'provider')."
  - "If you had to explain X to a junior dev in 60 seconds, what would you say?"
  - "What's the trade-off the author identified between X and Y? Do you agree?"
  - "X and Z look similar in UML — what's the intent difference?"
- For `demo` days: questions probe what changing the demo taught you. For `implement` days: questions probe what trade-offs you made in the homework.

### 6. Decide task count

Default: **2 checkbox tasks per subject = 6 total** (one step task + one apply task per subject). Comprehension questions are NOT checkboxes — they're inline prompts answered in Notes.

Bump to 3 tasks for a single subject only if:
- Step `implement` AND the homework has many "Done when" boxes that genuinely split (e.g., "complete checkboxes 1–3" + "complete checkboxes 4–6" + "retrospective + apply"). In that case the apply task can be folded into the implement work.
- Never exceed 3 tasks for any one subject. Cap total at 8.

### 7. Write `progress/<today>/todo.md`

Use Write (the file must not exist; step 1 guaranteed that). Template:

```markdown
# YYYY-MM-DD — Daily todo

## Yesterday (YYYY-MM-DD)

<one short paragraph: what got checked off, what didn't, which questions got answered. OR "Sprint starting — no prior day.">

---

## Agentic workflows — Level <N> (<level name>)

**Topic:** `<topic>` (#<index> in level) — step: `<read|demo|implement>`

**Files:**
- Master syllabus: [progress/agentic-workflows/SYLLABUS.md](../agentic-workflows/SYLLABUS.md)
- README: [<path>/README.md](../../<path>/README.md)
- Demo: [<path>/<demo file>](../../<path>/<demo file>)
- Homework: [<path>/homework.md](../../<path>/homework.md)
- Section syllabus: [agentic-workflows/SYLLABUS.md](../../agentic-workflows/SYLLABUS.md)

**Today:**
- [ ] **Step:** <step task wording per phrasing template>
- [ ] **Apply:** <concrete typing/building task — file path, ~line count, expected behavior>

**Prove it — answer in Notes:**
1. <grounded question 1>
2. <grounded question 2>
3. <grounded question 3 — optional, drop if forced>

---

## Software architecture — Level <N> (<level name>)

(same shape as above, with architecture-specific links and questions)

---

## Design patterns — Level <N> (<level name>) — Head First Ch <N>

**Topic:** `<chapter title>` (#<index> in level) — step: `<read|demo|implement>`
**Pattern(s):** <pattern names>
**Running example:** <chapter's running example>

**Files:**
- Master syllabus: [progress/design-patterns/SYLLABUS.md](../design-patterns/SYLLABUS.md)
- Head First chapter: read in your physical/digital copy of *Head First Design Patterns* (2nd ed)
- Repo pattern reference — README: [<repo path>/README.md](../../<repo path>/README.md)
- Repo pattern reference — Demo: [<repo path>/demo.js](../../<repo path>/demo.js)
- Repo pattern reference — Homework: [<repo path>/homework.md](../../<repo path>/homework.md)
- Family overview: [<family path>/README.md](../../<family path>/README.md)

(For chapters covering multiple patterns, list a Repo pattern reference block per pattern.)

**Today:**
- [ ] **Step:** <step task — explicitly references the Head First chapter, e.g., "Continue reading Ch <N> at your pace; aim for ~30–60 min today">
- [ ] **Apply:** <typing/building task — chapter's example or a small variant>

**Prove it — answer in Notes:**
1. <grounded question 1 — reference the chapter's running example>
2. <grounded question 2>
3. <grounded question 3 — optional>

---

## Notes

_(Free space — answer the "Prove it" questions here, jot insights, blockers, things to revisit.)_

### Agentic workflows — answers

1.
2.
3.

### Software architecture — answers

1.
2.
3.

### Design patterns — answers

1.
2.
3.
```

Important details:

- All file links are RELATIVE FROM `progress/YYYY-MM-DD/`. Master-syllabus links use `../<subject>/SYLLABUS.md`; repo-content links use `../../<path>`.
- Only include link lines for files that actually exist. Drop missing ones rather than producing dead links.
- For external topics: drop README/Demo/Homework lines and replace with a `Resource:` line quoting the syllabus's deliverable text. The Step task IS the deliverable (or a sub-goal of it for multi-day work). Apply task is still required — even external topics get a small concrete piece.
- Questions must be GROUNDED — specific to the topic's content, not generic. Read enough of the README (or use chapter knowledge for design-patterns) to generate them.

### 8. Report to the user

Show:
- Path to the new file (`progress/YYYY-MM-DD/todo.md`).
- For each subject: level + topic + step (one line).
- Total task count + total question count.
- One-line reminder: check boxes off as you go; answer the Prove-it questions in Notes; advance `state.md` when a topic's `implement` is done (or a step is finished and you're ready to move on) — or ask this skill to do it.

## Multi-day topics

A topic spans multiple days. The skill does NOT track "day in step" — it just keeps producing same-step tasks until you advance state. On a multi-day `read`, vary the apply task each day (use yesterday's notes to pick a fresh angle). On a multi-day `implement`, the apply task can be folded into the homework progress.

## Advancing state

This skill does NOT auto-advance `state.md`. The user advances it (or asks). When asked to advance a subject:

- Within a topic: bump `Next step`: `read` → `demo` → `implement`.
- After `implement` is done:
  - If there's a next topic in the same level: increment `Topic index in level` by 1, reset `Next step` to `read`, look up the new topic from the master syllabus and update all topic fields. Update `Last completed` to the just-finished topic + date.
  - If that was the last topic in the level: bump `Level` by 1, reset `Topic index in level` to 1, fetch the first topic of the new level.
  - If that was the final row: congratulate, mark the subject "syllabus complete," and ask whether to start a new sprint or pick external goals.

When advancing, ALWAYS re-read the master syllabus to pull the next topic — don't infer from memory.

## What this skill does NOT do

- Doesn't grade homework or check correctness.
- Doesn't skip ahead or reorder topics — syllabus order is the point.
- Doesn't exceed 8 tasks per day or 3 tasks per subject.
- Doesn't overwrite an existing `progress/<today>/todo.md` — that day's plan is locked once written.
- Doesn't auto-advance state — the user owns that decision.
- Doesn't generate generic comprehension questions — every question must be specific to today's topic content.
