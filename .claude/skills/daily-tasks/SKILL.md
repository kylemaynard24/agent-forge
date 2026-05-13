---
name: daily-tasks
description: Use to get today's single item (~30-90 min) from the currently active learning sprint. Designed for sustainable daily progress alongside a full-time job — pulls one chewable task at a time. Re-run on the same day after finishing to pull the next item and keep moving.
---

This skill is the **execution** half of the sprint loop. `/next-sprint` is the **planning** half — it generates the comprehensive sprint plan that this skill consumes from. If no active sprint exists, this skill stops and prompts the user to run `/next-sprint` first.

## The daily slice model

Real engineers with busy jobs need a floor that's easy to hit. One item per run keeps the habit alive even on hard days — and re-running is always an option when there's more time.

- A **sprint** (made by `/next-sprint`) covers one step (`read`, `demo`, or `implement`) for each of the four subjects, broken into ~10-14 discrete items totaling 10-15 hours. A sprint takes ~1-2 weeks of part-time work.
- A **daily slice** (made by this skill) is **1 item**. You get one fresh item per `/daily-tasks` call.
- Re-run on the same day if you finish — the skill asks "did you finish?" and either pulls the next item (yes) or shows you what you already have (no).

## Run order

Today's date is `currentDate` from system context. Use ISO `YYYY-MM-DD`.

### Step 1 — Sync with remote

Sprint state and daily todos live in git. The user studies from multiple machines (work laptop, home), so pulling first prevents stale-state drift — otherwise yesterday's slice from the other machine won't be visible and we'd generate a redundant todo.

Run `git pull --ff-only` from the repo root.

Outcomes:
- **Up-to-date or fast-forwarded cleanly:** continue silently to Step 2.
- **Not in a git repo / no remote / no upstream tracking branch / network or auth failure:** print a one-line warning ("`/daily-tasks` couldn't sync with remote: \<reason\>; working from local state") and continue. Don't block the slice over a missing or unreachable remote.
- **Refused (uncommitted local changes block it, or branches diverged):** STOP. Surface git's error verbatim and ask the user how to proceed (commit/stash the dirty file, or rebase/merge the divergence) before re-running. `--ff-only` is intentional — don't merge or rebase silently, since that can scramble the carefully-shaped sprint files (items.md state, prior daily todos).

After the run completes (Step 8 done), push changes back to the remote (Step 9).

### Step 2 — Find the active sprint

List `progress/sprints/` (skipping `README.md`). Find the most recent sprint folder by date that has an `items.md` with at least one unchecked `[ ]` item.

If no sprint folders exist OR all sprints are fully complete: STOP. Tell the user "No active sprint. Run `/next-sprint` to generate one." Do not generate today's todo.

If found: read `progress/sprints/<sprint-date>/items.md`. Identify all unchecked items (lines starting with `- [ ]`).

### Step 3 — Resolve focus area (optional)

If the user passed an area name as an argument (`/daily-tasks architecture`), filter the unchecked items to that subject only. Otherwise use all unchecked items.

If filtering produces zero items: tell the user "No unchecked items remain for `<area>` in the active sprint."

### Step 4 — Today's-todo handling

Before deciding whether to generate a new slice, reconcile stale dated folders in `progress/`:

- Inspect existing `progress/<date>/` directories (date-shaped folders only, excluding `sprints/`, `sessions/`, and subject state folders).
- Treat a dated folder as **no work completed** when its `todo.md` still has no checked `- [x]` items and the Notes section is still untouched template text, with no meaningful scratch files beyond the scaffolded `working-folder/README.md`.
- Delete stale dated folders older than yesterday when they meet that "no work completed" test. They are redundant copies of an unfinished slice.
- If **yesterday's** dated folder exists and also has no work completed, **move it forward to `progress/<today>/` instead of creating a brand-new todo**. Update the moved files so headings, dates, and working-folder references say `<today>`.

If `progress/<today>/todo.md` does NOT exist:
- If yesterday was carried forward into `progress/<today>/`, read that todo and show it as today's current slice. Do **not** pull a new item.
- Otherwise, pick the **next 1 unchecked item** from the filtered list (in its order in items.md).
- Continue to Step 5 to generate the file.

If `progress/<today>/todo.md` DOES exist:
- Read it.
- Use `AskUserQuestion`:
  - **Question:** "Today's todo at `progress/<today>/todo.md` already has items. Did you finish them?"
  - **Options (multiSelect: false):**
    - `yes_more` — Yes; pull the next item and append to today's todo.
    - `yes_done` — Yes, but I'm done for the day. Just show me what I completed.
    - `no_show` — Not yet. Show me the current todo.
- Branch:
  - `yes_more` → mark the previously-listed items as `[x]` in items.md, pick the **next 1 unchecked item**, APPEND a new "## Round N (added <time>)" section to today's todo.
  - `yes_done` → mark items as `[x]` in items.md, show today's todo, stop.
  - `no_show` → show today's existing todo, stop.

### Step 5 — Generate / append the slice

Each chosen item gets a section in today's todo. Format per item:

```markdown
### <item-id>: <item summary>

**Time:** ~<minutes> min · **Subject:** <subject> · **Sprint section:** "<section title>" in [sprint.md](../sprints/<sprint-date>/sprint.md)

<inline brief — 5-10 lines summarizing what to do, pulled from the sprint section. Goal: the user can act on this without flipping to the sprint file. If the item is "answer questions," include the question text inline. If the item references a file to read (README, sprint section, etc.), include a relative markdown link to it. Since today's todo lives at `progress/<today>/todo.md`, paths two levels up land at the repo root — e.g., a README at `software-engineering/foo/bar/README.md` becomes `[bar](../../software-engineering/foo/bar/README.md)` (use the containing directory name as the link text, not "README.md"). Always use a relative path so the link is clickable in any markdown viewer.>

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

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_
```

### Step 6 — Mark items as in-progress in items.md

For each item that went into today's slice, change its checkbox in `progress/sprints/<sprint-date>/items.md` from `- [ ]` to `- [~]` (in-progress). When the user marks it done in their todo (or answers `yes_more` / `yes_done` on the next /daily-tasks run), the skill updates `[~]` → `[x]`.

This lets the skill distinguish: unstarted (`[ ]`), assigned-but-pending (`[~]`), done (`[x]`).

### Step 7 — Scaffold today's working folder

Create `progress/<today>/working-folder/<subject>/` for each subject that today's slice touches. (Skip if today's todo already exists — the folders should already be there.)

Also write a top-level `progress/<today>/working-folder/README.md` if it doesn't already exist. The repo's `.gitignore` ignores everything inside `working-folder/` *except* this README, so committing it makes the date's working-folder visible in the repo even though its scratch contents stay local. This matters for multi-machine study: when the user pulls on the other laptop, the folder structure exists and they can pick up immediately.

README content (only-create-if-missing — never overwrite a README that's already there):

```markdown
# Working area for <YYYY-MM-DD>

Scratch space for today's daily slice. See [`../todo.md`](../todo.md) for the items being worked on.

Everything in this folder is gitignored EXCEPT this README — that's why the folder shows up in the repo even when you push from a clean session. Subject subfolders (`agentic-workflows/`, `architecture/`, etc.) are scaffolded on demand based on what today's slice touches; their contents are local-only and won't appear on other machines.
```

### Step 8 — Report to the user

Show:
- Path to today's todo.
- Items added this round (id + summary + time).
- Sprint progress: "N of M items complete (X% through the sprint)."
- One-line reminder: "Run `/daily-tasks` again today if you finish, or tomorrow for a new slice."

### Step 9 — Push to remote

After reporting to the user, stage and commit any files changed during this run (today's todo, items.md, working-folder README, any state bootstrapping), then push.

```
git add progress/
git commit -m "daily-tasks: <YYYY-MM-DD> slice — <item-id(s)>"
git push
```

Outcomes:
- **Pushed cleanly:** print one line: "Synced to remote."
- **Nothing to commit:** skip the commit; still attempt `git push` in case a previous commit was un-pushed, then print "Nothing new to commit; remote already up to date."
- **No remote / no upstream / network failure:** print a one-line warning and do not block the user. The slice is already written locally.
- **Push rejected (remote has diverged):** print git's error verbatim and tell the user to resolve on their next run; do not force-push.

## Sprint completion

When the LAST item in items.md is checked, the sprint is complete. The next `/daily-tasks` invocation will see no unchecked items and tell the user "Sprint at `progress/sprints/<date>/` is complete. Run `/next-sprint` to generate the next one." `/next-sprint` will then advance state and produce the next sprint.

## Bootstrapping a fresh clone

If any `progress/<subject>/state.md` is missing, create it from the syllabus's Level 1 Topic 1 / step `read` (silent bootstrap). Then tell the user to run `/next-sprint` to create the first sprint, since this skill needs an active sprint to consume from.

## Hard constraints

- **Don't generate sprint content.** This skill is a slice picker — it pulls from existing sprint content. The sprint content is generated by `/next-sprint`. If a slice item references a sprint section that doesn't exist, surface as a blocker.
- **Don't advance state.** State advances only when a sprint completes and `/next-sprint` is invoked again. This skill never edits `state.md`.
- **Don't generate more than 1 item per round.** Even if items are tiny. The sustainability constraint is the point.
- **Don't overwrite today's todo.** Append rounds; never replace prior content.
