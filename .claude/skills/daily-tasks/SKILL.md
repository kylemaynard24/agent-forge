---
name: daily-tasks
description: Use to get today's small slice (2-3 items, ~1-2 hours) from the currently active learning sprint. Designed for sustainable daily progress alongside a full-time job — pulls a chewable amount of work from the sprint plan rather than asking you to do everything in one day. Re-run on the same day after finishing to pull the next slice.
---

This skill is the **execution** half of the sprint loop. `/next-sprint` is the **planning** half — it generates the comprehensive sprint plan that this skill consumes from. If no active sprint exists, this skill stops and prompts the user to run `/next-sprint` first.

## The daily slice model

Real engineers have ~1-3 hours per working day for self-directed learning. The previous version of this skill generated 6-10+ hours of content per day, which only worked as a sabbatical. The new model:

- A **sprint** (made by `/next-sprint`) covers one step (`read`, `demo`, or `implement`) for each of the four subjects, broken into ~10-14 discrete items totaling 10-15 hours. A sprint takes ~1-2 weeks of part-time work.
- A **daily slice** (made by this skill) is 2-3 items, ~1-2 hours of work. You get one fresh slice per `/daily-tasks` call.
- Re-run on the same day if you finish — the skill asks "did you finish?" and either pulls the next 2-3 items (yes) or shows you what you already have (no).

## Run order

Today's date is `currentDate` from system context. Use ISO `YYYY-MM-DD`.

### Step 1 — Find the active sprint

List `progress/sprints/` (skipping `README.md`). Find the most recent sprint folder by date that has an `items.md` with at least one unchecked `[ ]` item.

If no sprint folders exist OR all sprints are fully complete: STOP. Tell the user "No active sprint. Run `/next-sprint` to generate one." Do not generate today's todo.

If found: read `progress/sprints/<sprint-date>/items.md`. Identify all unchecked items (lines starting with `- [ ]`).

### Step 2 — Resolve focus area (optional)

If the user passed an area name as an argument (`/daily-tasks architecture`), filter the unchecked items to that subject only. Otherwise use all unchecked items.

If filtering produces zero items: tell the user "No unchecked items remain for `<area>` in the active sprint."

### Step 3 — Today's-todo handling

If `progress/<today>/todo.md` does NOT exist:
- Pick the next 2-3 unchecked items from the filtered list (in their order in items.md). Aim for a total estimated time of ~60-120 minutes — three short items, or one big + one small.
- Continue to Step 4 to generate the file.

If `progress/<today>/todo.md` DOES exist:
- Read it.
- Use `AskUserQuestion`:
  - **Question:** "Today's todo at `progress/<today>/todo.md` already has items. Did you finish them?"
  - **Options (multiSelect: false):**
    - `yes_more` — Yes; pull the next 2-3 items and append to today's todo.
    - `yes_done` — Yes, but I'm done for the day. Just show me what I completed.
    - `no_show` — Not yet. Show me the current todo.
- Branch:
  - `yes_more` → mark the previously-listed items as `[x]` in items.md, pick the next 2-3 unchecked items, APPEND a new "## Round N (added <time>)" section to today's todo.
  - `yes_done` → mark items as `[x]` in items.md, show today's todo, stop.
  - `no_show` → show today's existing todo, stop.

### Step 4 — Generate / append the slice

Each chosen item gets a section in today's todo. Format per item:

```markdown
### <item-id>: <item summary>

**Time:** ~<minutes> min · **Subject:** <subject> · **Sprint section:** "<section title>" in [sprint.md](../sprints/<sprint-date>/sprint.md)

<inline brief — 5-10 lines summarizing what to do, pulled from the sprint section. Goal: the user can act on this without flipping to the sprint file. If the item is "answer questions," include the question text inline. If the item is "read README," include the primer + the link to the README.>

**Done when:** <2-3 specific completion criteria>

- [ ] Mark this item complete here AND in `progress/sprints/<sprint-date>/items.md` when finished.
```

The slice file structure:

```markdown
# YYYY-MM-DD — Today's slice

> **Active sprint:** [progress/sprints/<sprint-date>/sprint.md](../sprints/<sprint-date>/sprint.md)
> **Sprint progress:** N of M items complete · K remaining after today's slice
> **Working folder:** `progress/<today>/working-folder/<subject>/` (scaffolded; gitignored)

## Round 1 (~<total-min> min)

### <item-id>: ...

(per the format above)

### <item-id>: ...

### <item-id>: ...

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_
```

### Step 5 — Mark items as in-progress in items.md

For each item that went into today's slice, change its checkbox in `progress/sprints/<sprint-date>/items.md` from `- [ ]` to `- [~]` (in-progress). When the user marks it done in their todo (or answers `yes_more` / `yes_done` on the next /daily-tasks run), the skill updates `[~]` → `[x]`.

This lets the skill distinguish: unstarted (`[ ]`), assigned-but-pending (`[~]`), done (`[x]`).

### Step 6 — Scaffold today's working folder

Same as the previous version. Create `progress/<today>/working-folder/<subject>/` for each subject that today's slice touches. (Skip if today's todo already exists — the folders should already be there.)

### Step 7 — Report to the user

Show:
- Path to today's todo.
- Items added this round (id + summary + time).
- Sprint progress: "N of M items complete (X% through the sprint)."
- One-line reminder: "Run `/daily-tasks` again today if you finish, or tomorrow for a new slice."

## Sprint completion

When the LAST item in items.md is checked, the sprint is complete. The next `/daily-tasks` invocation will see no unchecked items and tell the user "Sprint at `progress/sprints/<date>/` is complete. Run `/next-sprint` to generate the next one." `/next-sprint` will then advance state and produce the next sprint.

## Bootstrapping a fresh clone

If any `progress/<subject>/state.md` is missing, create it from the syllabus's Level 1 Topic 1 / step `read` (silent bootstrap). Then tell the user to run `/next-sprint` to create the first sprint, since this skill needs an active sprint to consume from.

## Hard constraints

- **Don't generate sprint content.** This skill is a slice picker — it pulls from existing sprint content. The sprint content is generated by `/next-sprint`. If a slice item references a sprint section that doesn't exist, surface as a blocker.
- **Don't advance state.** State advances only when a sprint completes and `/next-sprint` is invoked again. This skill never edits `state.md`.
- **Don't generate more than 3 items per round.** Even if items are tiny. The sustainability constraint is the point.
- **Don't overwrite today's todo.** Append rounds; never replace prior content.
