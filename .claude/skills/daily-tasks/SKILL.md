---
name: daily-tasks
description: Use to get today's single item (~30-90 min) from the currently active learning sprint, plus a fresh daily reading list of 3 articles from curated engineering blogs, plus a daily stretch research prompt in adjacent territory. Designed for sustainable daily progress alongside a full-time job — pulls one chewable task at a time, and keeps the learning loop alive even on days when the sprint task can't be finished. Re-run on the same day after finishing to pull the next item and keep moving.
---

This skill is the **execution** half of the sprint loop. `/next-sprint` is the **planning** half — it generates the comprehensive sprint plan that this skill consumes from. If no active sprint exists, this skill stops and prompts the user to run `/next-sprint` first.

## The daily slice model

Real engineers with busy jobs need a floor that's easy to hit. One item per run keeps the habit alive even on hard days — and re-running is always an option when there's more time.

- A **sprint** (made by `/next-sprint`) covers one step (`read`, `demo`, or `implement`) for each of the four subjects, broken into ~10-14 discrete items totaling 10-15 hours. A sprint takes ~1-2 weeks of part-time work.
- A **daily slice** (made by this skill) is **1 sprint item + a 3-article reading list + a stretch research prompt**. You get one fresh sprint item per `/daily-tasks` call, plus a fresh set of 3 articles and a fresh research prompt every calendar day (refreshed even if yesterday's sprint item carried forward).
- The reading list is the floor-of-the-floor: if the sprint item is too heavy for today, you can still learn by reading. As long as you can read, you can learn — even if you can't get the work done.
- The stretch prompt is *adjacent* territory — a research question deliberately disjoint from today's reading and sprint subject. 15–30 min of research, 300–500 words of writing. Builds breadth alongside the sprint's depth.
- Re-run on the same day if you finish — the skill asks "did you finish?" and either pulls the next item (yes) or shows you what you already have (no). Articles and stretch prompt are not regenerated mid-day.

## Run order

Today's date is `currentDate` from system context. Use ISO `YYYY-MM-DD`.

### Step 1 — Sync with remote

Sprint state and daily todos live in git. The user studies from multiple machines (work laptop, home), so pulling first prevents stale-state drift — otherwise yesterday's slice from the other machine won't be visible and we'd generate a redundant todo.

Run `git pull --ff-only` from the repo root.

Outcomes:
- **Up-to-date or fast-forwarded cleanly:** continue silently to Step 2.
- **Not in a git repo / no remote / no upstream tracking branch / network or auth failure:** print a one-line warning ("`/daily-tasks` couldn't sync with remote: \<reason\>; working from local state") and continue. Don't block the slice over a missing or unreachable remote.
- **Refused (uncommitted local changes block it, or branches diverged):** STOP. Surface git's error verbatim and ask the user how to proceed (commit/stash the dirty file, or rebase/merge the divergence) before re-running. `--ff-only` is intentional — don't merge or rebase silently, since that can scramble the carefully-shaped sprint files (items.md state, prior daily todos).

After the run completes (Step 10 done), push changes back to the remote (Step 11).

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
- If **yesterday's** dated folder exists and also has no work completed, **move it forward to `progress/<today>/` instead of creating a brand-new todo**. Update the moved files so headings, dates, and working-folder references say `<today>`. **Also strip any existing `## 📚 Today's reading (...)` and `## 🧪 Stretch prompt (...)` sections from the moved todo** — Steps 6 and 7 will repopulate them with fresh content dated today. Also delete any prior `stretch-prompt.md` stub in the moved folder. (The reading list and stretch prompt are the parts of the slice that do *not* roll forward: even when the sprint item carries, both are always fresh for today.)

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

## 📚 Today's reading (<today>)

_(Populated by Step 6 — 3 articles from the reading-source pool.)_

## 🧪 Stretch prompt (<today>)

_(Populated by Step 7 — one research question in adjacent territory.)_

## Round 1 (~<total-min> min)

### <item-id>: ...

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_
```

The "## 📚 Today's reading" section sits **above** the sprint round so the reading list is glanceable first — important for days when you can read but can't get the sprint work done.

### Step 6 — Refresh today's reading list

Goal: ensure `progress/<today>/todo.md` has a `## 📚 Today's reading (<today>)` section with 3 articles, dated for today, AND that each article gets appended to the running reading log at `progress/reading-log.md`.

**Skip condition.** If the file already contains a `## 📚 Today's reading (<today>)` heading (note: the date in the heading must match today), the section is current — do nothing and move to Step 7. Do not re-append to the log; today's entries are already there.

**Fetch flow.**

1. Read source list from `.claude/skills/daily-tasks/reading-sources.md` (sibling of this SKILL.md). For each source, capture BOTH its display name and homepage URL (used as the source link) and its feed URL (used for fetching).
2. Build the "recently shown" exclusion set: read `progress/reading-log.md` if it exists and collect every article URL from its most recent 7 dated sections. Avoid recommending any URL in that set. (If `reading-log.md` doesn't exist yet, the exclusion set is empty — the next step will create the file.)
3. For each source, in order, use `WebFetch` on the feed URL with a prompt like: *"Return the 3 most recent published articles in this feed as a list of (title, full URL, 1-sentence summary of what the article is about). Order by recency."* If the feed errors or returns no usable content, retry with the homepage URL.
4. From each source's response, pick the most-recent article whose URL is not in the exclusion set AND whose title does not look like a newsletter/digest/roundup. Skip titles matching `/weekly|digest|roundup|newsletter|^issue #?\d+|edition|recap/i` — those are curated link lists, not deep articles. The user wants substantive technical deep-dives, not "this week in X" pointers. If every recent article from a source is roundup-shaped, move to the next source rather than dropping the quality bar. Record (title, article-url, source-name, source-homepage-url, 1-sentence hook).
5. Stop once 3 articles are collected.
6. If the source pool is exhausted with fewer than 3 collected, cycle back to the first successful source and pick the next-most-recent article from its earlier response (still respecting the exclusion set).
7. If after a full second pass you still have fewer than 3, write whatever you have plus a one-line note: *"Couldn't reach <comma-separated source names>; only fetched N articles today."* Don't block the slice over article failures.

**Section format** (replace any existing `## 📚 Today's reading` block in today's todo, or insert immediately after the blockquote header / before the first `## Round` heading). Note: the source name is itself a link to the source's homepage — the homepage is intentionally the "more like this" doorway, since it lists many more articles than the one we surfaced.

```markdown
## 📚 Today's reading (<today>)

Three short reads to keep the learning loop alive even when the sprint item is heavy. The source link goes to the site's archive — click it if you want deeper resources beyond the single article we picked today.

1. **[<title>](<article-url>)** — via [<source name>](<source-homepage-url>)
   <1-sentence hook>

2. **[<title>](<article-url>)** — via [<source name>](<source-homepage-url>)
   <1-sentence hook>

3. **[<title>](<article-url>)** — via [<source name>](<source-homepage-url>)
   <1-sentence hook>
```

**Append to the running reading log.** After writing the section above into today's todo, append the same 3 (or N) articles to `progress/reading-log.md`. This file is the long-term record of every article surfaced — useful as both an exclusion source for future days and as a learning trail the user can re-read later.

If `progress/reading-log.md` does NOT exist, create it with this header first:

```markdown
# Reading log

Every article surfaced by `/daily-tasks`, chronological. Most recent entries at the top. The skill uses the most-recent 7 dated sections of this file as the "already shown" exclusion list when picking the next batch.
```

Then prepend a new dated section above any existing entries (most-recent-first):

```markdown
## <today>

- **[<title>](<article-url>)** — via [<source name>](<source-homepage-url>)
  <1-sentence hook>
- **[<title>](<article-url>)** — via [<source name>](<source-homepage-url>)
  <1-sentence hook>
- **[<title>](<article-url>)** — via [<source name>](<source-homepage-url>)
  <1-sentence hook>
```

(If fewer than 3 articles were fetched, log whatever you got — do not invent entries.)

**Failure handling.** If `WebFetch` is unavailable (denied by permissions, no network, etc.), write the section in today's todo with placeholder text: *"Couldn't fetch today's articles (WebFetch unavailable). Sources to check manually: [list each homepage URL]."* Do NOT append anything to `reading-log.md` in this case — the log only records real articles. Continue with the rest of the run.

### Step 7 — Generate today's stretch research prompt

Goal: ensure `progress/<today>/todo.md` has a `## 🧪 Stretch prompt (<today>)` section with one research question in adjacent territory, AND that a stub writeup file exists at `progress/<today>/stretch-prompt.md`, AND that the question is appended to `progress/stretch-prompt-log.md`.

**Skip condition.** If today's todo already contains a `## 🧪 Stretch prompt (<today>)` heading (date matches today), it's current — do nothing and move to Step 8.

**Generation flow.**

1. Read the theme pool from `.claude/skills/daily-tasks/stretch-themes.md` (sibling of this SKILL.md).
2. Read the most recent 14 entries from `progress/stretch-prompt-log.md` (if it exists) to see which themes and questions were used recently. Avoid re-picking a theme used in the last few days, and never repeat a question.
3. Identify today's "off-limits" subjects: the topics covered by today's reading list (Step 6) and today's sprint item (the subject + what the item is about). The stretch prompt MUST NOT overlap with any of these — the whole point is adjacent breadth, not reinforcement.
4. Pick a theme not used recently, then generate ONE focused research question within it. The question should be answerable in 300–500 words after 15–30 min of research — concrete, not a textbook chapter, not a one-liner. Write a 1–2 sentence "why this matters" framing and 3 angles to cover.

**Section format** (replace any existing `## 🧪 Stretch prompt` block in today's todo, or insert immediately after the `## 📚 Today's reading` section / before the first `## Round` heading):

```markdown
## 🧪 Stretch prompt (<today>)

Adjacent-territory research — deliberately unrelated to today's reading and sprint item. ~15–30 min of research, ~300–500 words of your own writing.

**Question:** <one focused research question>

**Why this matters:** <1–2 sentences — what concept this builds and where it shows up in real systems>

**Angles to cover:**
- <angle 1>
- <angle 2>
- <angle 3>

**Write your response in** [`stretch-prompt.md`](stretch-prompt.md) — it's tracked, so your writeups accumulate into a portfolio of thinking over time.
```

**Create the writeup stub.** Write `progress/<today>/stretch-prompt.md` (only if it doesn't already exist) containing the question, the framing, the angles, and an empty `## My response` section for the user to fill in. This file is tracked (NOT under working-folder), so writeups persist across machines and build a visible record.

**Append to the log.** Prepend a dated entry to `progress/stretch-prompt-log.md` (most-recent-first). Create the file with a header if missing:

```markdown
# Stretch prompt log

Every stretch research prompt surfaced by `/daily-tasks`, chronological (most recent first). The skill reads the most recent 14 entries to avoid repeating themes/questions.

## <today> — <theme>

<the question>
```

**Failure handling.** This step needs no network — it's generated from the theme pool. If the theme pool file is missing, fall back to a sensible default theme (distributed systems fundamentals) and note it. Never block the slice.

### Step 8 — Mark items as in-progress in items.md

For each item that went into today's slice, change its checkbox in `progress/sprints/<sprint-date>/items.md` from `- [ ]` to `- [~]` (in-progress). When the user marks it done in their todo (or answers `yes_more` / `yes_done` on the next /daily-tasks run), the skill updates `[~]` → `[x]`.

This lets the skill distinguish: unstarted (`[ ]`), assigned-but-pending (`[~]`), done (`[x]`).

### Step 9 — Scaffold today's working folder

Create `progress/<today>/working-folder/<subject>/` for each subject that today's slice touches. (Skip if today's todo already exists — the folders should already be there.)

Also write a top-level `progress/<today>/working-folder/README.md` if it doesn't already exist. The repo's `.gitignore` ignores everything inside `working-folder/` *except* this README, so committing it makes the date's working-folder visible in the repo even though its scratch contents stay local. This matters for multi-machine study: when the user pulls on the other laptop, the folder structure exists and they can pick up immediately.

README content (only-create-if-missing — never overwrite a README that's already there):

```markdown
# Working area for <YYYY-MM-DD>

Scratch space for today's daily slice. See [`../todo.md`](../todo.md) for the items being worked on.

Everything in this folder is gitignored EXCEPT this README — that's why the folder shows up in the repo even when you push from a clean session. Subject subfolders (`agentic-workflows/`, `architecture/`, etc.) are scaffolded on demand based on what today's slice touches; their contents are local-only and won't appear on other machines.
```

### Step 10 — Report to the user

Show:
- Path to today's todo.
- Items added this round (id + summary + time).
- Today's reading list: 3 article titles (or however many were fetched), with sources. Keep this brief — the full links live in the todo file.
- Today's stretch prompt: the one-line question.
- Sprint progress: "N of M items complete (X% through the sprint)."
- One-line reminder: "Run `/daily-tasks` again today if you finish, or tomorrow for a new slice."

### Step 11 — Push to remote

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
- **Don't generate more than 1 sprint item per round.** Even if items are tiny. The sustainability constraint is the point. (The reading list is separate — always 3 articles per day, not gated by item count.)
- **Don't overwrite today's todo's existing content.** Append sprint rounds; never replace prior content. The one exception is the `## 📚 Today's reading (<today>)` section, which is rewritten in place if it's missing or dated for a prior day.
- **Don't recommend articles from outside the source pool.** The pool lives in `reading-sources.md`. If the user wants new sites, they add them there.
- **Don't fabricate article content.** If `WebFetch` fails or returns nothing usable, write the failure note rather than inventing titles/summaries. The reading log only records real articles — never log a placeholder.
- **Don't rewrite past entries in `reading-log.md`.** Prepend today's section above the most recent prior section. Past entries are an audit trail — leave them alone even if a URL later 404s.
- **The stretch prompt must not overlap with today's reading or sprint subject.** Adjacent breadth is the whole point. If the only fresh theme would overlap, pick a different theme.
- **Don't overwrite a user's `stretch-prompt.md` writeup.** Create the stub only if the file is missing. If it exists (user may have started writing), leave it alone.
