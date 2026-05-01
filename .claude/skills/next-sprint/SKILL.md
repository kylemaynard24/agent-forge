---
name: next-sprint
description: Use to generate a comprehensive learning sprint covering all four tracked subjects (agentic workflows, software architecture, design patterns, devops) at their current state position. The sprint contains the full reading material, apply tasks, comprehension questions, and extra credit — broken into discrete items the /daily-tasks skill draws from one slice at a time. Run at the start of a new sprint cycle (when the previous sprint is complete, or when you want to refresh).
---

This skill is the **planning** half of the sprint loop. `/daily-tasks` is the **execution** half. The split exists because the comprehensive plan is too much to consume in one day for someone with a full-time job — sprints span ~1-2 weeks of part-time work, and `/daily-tasks` pulls a sustainable 2-3 items at a time.

## How the two skills relate

```
/next-sprint
   → produces progress/sprints/YYYY-MM-DD/sprint.md  (full plan: ~12 items, ~10-15 hours)
   → produces progress/sprints/YYYY-MM-DD/items.md   (flat checklist used by /daily-tasks)
   → does NOT advance state.md (state advances only when the sprint is fully consumed)

/daily-tasks
   → finds the most recent unfinished sprint
   → picks the next 2-3 unchecked items from items.md
   → produces progress/<today>/todo.md (small slice, ~1-2 hours)
   → updates items.md to mark items in progress / done
   → on re-run same day, asks "finished today's items?" — if yes, pulls 2-3 more
```

A sprint covers ONE step (`read`, `demo`, or `implement`) for each of the four subjects at their current topic. So a sprint takes one topic-step's worth of all four subjects from "haven't started" to "done." When a sprint completes, run `/next-sprint` again — it advances state by one step and generates the next sprint.

## Subjects and area registry

Same as `/daily-tasks`. Four default tracked subjects: `agentic-workflows`, `architecture`, `design-patterns`, `devops`. State files at `progress/<subject>/state.md`; syllabuses at `learning-syllabuses/<subject>.md`.

## Run order

### Step 1 — Check for an active sprint

List `progress/sprints/` (excluding `README.md`). Find the most recent sprint folder by date.

If a sprint exists and its `items.md` has unchecked items: ask the user via `AskUserQuestion`:
- "An active sprint exists at `progress/sprints/<date>/` with N of M items unchecked. Generate a NEW sprint anyway?"
- Options: `keep_existing` (stop, do nothing), `generate_new` (continue with current state), `archive_and_new` (move existing to `progress/sprints/<date>/archived.md` then continue).

If `keep_existing`: stop and report which sprint is active.

If no sprint exists OR user chose to generate new OR most-recent sprint is fully done: continue to Step 2.

### Step 2 — Determine state advancement

If the most recent sprint exists AND is fully complete (every item in items.md checked):
- Advance each subject's `state.md` by one step (`read` → `demo` → `implement`, or implement → next topic).
- See `/daily-tasks` "Advancing state" section for the exact mechanics.

If no prior sprint OR user explicitly wants fresh-from-current-state: do NOT advance state. Use the current state as-is.

### Step 3 — Read state and syllabuses

In parallel, read all four `progress/<subject>/state.md` and all four `learning-syllabuses/<subject>.md`. Resolve current topic + step for each subject (same logic `/daily-tasks` used previously).

### Step 4 — Generate the comprehensive sprint plan

Write `progress/sprints/<today>/sprint.md` with the full content the previous `/daily-tasks` skill generated:

- **Sprint header:** date, current topic for each subject, total estimated hours, total items.
- **Per-subject section** (one for each of the four subjects):
  - Topic + step + state position
  - Files (links to README, demo, homework, syllabus, today's working folder placeholder)
  - Reading material: primer, key concepts, watch-for, excerpt, deep dive (full content as in the prior /daily-tasks)
  - Step task brief
  - Apply task brief (broken into 1-3 sub-items in the items list)
  - Prove-it questions (full text + model answers + how-to-approach explanations at the bottom)
  - Extra credit (papers/talks)
  - C# extra credit (for the three subjects whose apply tasks are C#)
- **Sprint items list** (at the bottom of sprint.md, also written separately as items.md): every discrete item, ordered, with estimated time and pointer to which sprint section to read for full context.

### Step 5 — Generate the items checklist

Write `progress/sprints/<today>/items.md` — a flat checklist for `/daily-tasks` to consume. Format per item:

```markdown
- [ ] **<id>** — (~<minutes> min) <one-line summary>. <subject>: <step>. See sprint section "<section title>".
```

Item IDs are sequential: `S-01`, `S-02`, ... `S-12` for a typical 12-item sprint. The format is rigid — `/daily-tasks` parses it.

Order the items so each subject's items group together (read → apply → questions for that subject), with the four subjects interleaved by which one is fastest to complete (so the user gets a sense of completion early in the sprint). Default order: agentic items, architecture items, design-patterns items, devops items — matching the conventional subject ordering.

A typical sprint has 10-14 items totaling 10-15 hours. Each item is sized 15-90 minutes (not larger). Apply tasks that genuinely need 2+ hours get split into multiple items (e.g., "S-04a: Build the Duck base + 2 subclasses" + "S-04b: Add IFlyBehavior interface + 2 implementations").

### Step 6 — Report to the user

Show:
- Path to the new sprint plan and items file.
- The four subjects and their current topics (one line each).
- Total item count and estimated hours.
- One-line: "Run `/daily-tasks` to start working — it'll pull 2-3 items per session."

## What this skill does NOT do

- Doesn't replace existing `progress/<date>/todo.md` files.
- Doesn't advance state on its own beyond the "previous sprint complete" case (Step 2).
- Doesn't pick which items go in today's slice — that's `/daily-tasks`'s job.
- Doesn't fabricate quotes, papers, or content not grounded in the source material — same constraints as `/daily-tasks`.

## Sprint completion

When all items in a sprint's `items.md` are checked, the sprint is complete. The next `/next-sprint` invocation (Step 2) advances state and generates the next sprint. The old sprint folders stay in `progress/sprints/` as a learning history — they're git-tracked, so you can see what you've worked through.

## Bootstrapping a fresh clone

Same logic as the previous `/daily-tasks`: if any `progress/<subject>/state.md` is missing, create it from the syllabus's Level 1 Topic 1 / step `read`. Bootstrap silently and note in the report.
