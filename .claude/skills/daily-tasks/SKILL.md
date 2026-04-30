---
name: daily-tasks
description: Use when the user wants their daily learning tasks. By default produces a plan covering three tracked subjects (agentic workflows, software architecture, design patterns). Accepts area-name argument(s) to focus on a different repo learning area instead. Each subject's section includes inline reading material (primer + key concepts + watch-for + excerpt), a step task, an apply task, and 2-3 comprehension questions.
---

This skill produces one file per working day under `progress/<today>/`. Each subject's section includes:
- **Reading material** — a primer, key concepts, what to watch for, and a verbatim excerpt — so the user is oriented before opening the linked README or book.
- **Step task** — today's read/demo/implement work.
- **Apply task** — a small concrete piece to physically type and build.
- **Prove-it questions** — 2–3 grounded comprehension questions answered inline in Notes.

The day always ends with the user having read something, typed something, and proven they understood it.

## Area registry — the only valid areas

The skill **enforces** that any area name resolves to a learning directory that already exists in this repo. The registry below is the authoritative list. To add a new area, both the repo path AND ideally a `progress/<area>/SYLLABUS.md` + `state.md` should exist.

| Area name | Repo path | Tracked? (has progress/ state) | Notes |
|---|---|---|---|
| `agentic-workflows` | `agentic-workflows/` | yes (default) | 6-stage agent dojo; multi-day topics |
| `architecture` | `software-engineering/architecture/` | yes (default) | 8 sections, fundamentals → distributed systems |
| `design-patterns` | `software-engineering/design-patterns/` | yes (default) | Head First chapter order; multi-day chapters |
| `advanced-engineering` | `software-engineering/advanced-engineering/` | no | 6 sections: debugging, testing, perf, security, refactoring, incident response |
| `super-beginner-javascript` | `software-engineering/super-beginner-javascript/` | no | 12 sections, JS from values up through a mini-capstone |

When verifying an area, confirm the **Repo path** actually exists on disk (`ls` it). If it doesn't, fail with the available list. Do not invent areas; do not accept arbitrary directory paths from the user — only the registered names above.

## Subjects, syllabuses, and state — for the three defaults

| Key | Master syllabus | State file |
|---|---|---|
| agentic-workflows | `progress/agentic-workflows/SYLLABUS.md` | `progress/agentic-workflows/state.md` |
| architecture | `progress/architecture/SYLLABUS.md` | `progress/architecture/state.md` |
| design-patterns | `progress/design-patterns/SYLLABUS.md` | `progress/design-patterns/state.md` |

Each syllabus has 4 levels (Beginner → Expert). Topics span multiple days — the skill keeps producing same-step tasks until the user advances state.

## Run order

Today's date is `currentDate` from system context. Use ISO `YYYY-MM-DD`.

### Step 0 — Resolve which areas to plan for

Look at the user's invocation arguments (if any).

- **No arguments → default mode.** Subjects = `[agentic-workflows, architecture, design-patterns]`. Output file: `progress/<today>/todo.md`.
- **One or more area names → focused mode.** Subjects = the named areas (in the order given).
  - Validate each name against the area registry above. If a name is not in the registry, STOP and tell the user the valid names. Do not partially proceed.
  - Validate each name's `Repo path` exists on disk. If not, STOP and surface this — the registry is stale and needs updating.
  - Output file: `progress/<today>/<area>.md` for a single area, or `progress/<today>/<area1>-<area2>...md` for multiple. (Never overwrite the default `todo.md`.)

For each subject in the resolved list, decide its planning mode:

- **Tracked subject** (has `progress/<subject>/SYLLABUS.md` AND `state.md`): use the full sprint flow (Steps 1–8 below).
- **Untracked area** (in registry but no progress/ state): use **discovery mode**:
  - Pick the lowest-numbered top-level subdir of the area's repo path (e.g., `01-debugging-and-diagnostics/`).
  - Inside it, pick the first lexicographically-ordered topic subdir.
  - Treat it as Level 1, index 1, step `read`.
  - Generate the same Reading material + Step + Apply + Prove-it sections.
  - At the end of the subject section, include a callout: "**To track this area as a sprint subject, ask me to create `progress/<area>/SYLLABUS.md` and `state.md`.**"

### Step 1 — Idempotency check

If the resolved output file already exists, do NOT regenerate. Read it and show it to the user with a note that the plan is already set. Stop.

### Step 2 — Load syllabus + state for each tracked subject

In parallel, Read all syllabuses and state files for tracked subjects in the resolved list. For each:
- From state: `Level`, `Topic index in level`, `Next step`.
- From syllabus level table row #`Topic index in level`: topic name, repo path(s), running example (design-patterns only).

If state's path disagrees with the syllabus, trust the syllabus and note the correction in the todo. If the index exceeds the level's topic count, flag it loudly and ask the user to advance the level.

### Step 3 — Verify topic files (skip for external topics)

For repo paths starting with `agentic-workflows/` or `software-engineering/`:
- step `read` → README.md exists
- step `demo` → at least one `demo.*` file exists
- step `implement` → `homework.md` exists

For multi-pattern chapters (e.g., Head First Ch 4, 7, 9): verify each linked dir. Fall back to next available step if a needed file is missing. If the topic dir doesn't exist, surface as a blocker.

For external topics: skip file verification; the implement step uses the syllabus deliverable text directly.

### Step 4 — Find yesterday's folder

List `progress/` for entries matching `YYYY-MM-DD`. Pick the most recent strictly before today. If found, Read its `todo.md` (or the matching ad-hoc file if you're in focused mode for the same area set) and capture: which boxes were checked, any inline notes, what was left unchecked, which questions got answered. Yesterday's section paraphrases this in one short paragraph.

If none, "Sprint starting — no prior day." If yesterday's only entries are for a different area set, mention that briefly.

### Step 5 — Generate today's per-subject content

For each subject, produce:

#### A. Reading material (the inline content the user reads in the todo itself)

Generate by **reading the topic's actual README** (for repo topics) or by drawing on common knowledge of the chapter (for design-patterns Head First chapters). Produce:

- **Primer** — 4–6 sentences orienting the reader to today's topic. Specific, not generic. State what the topic is, the problem it addresses, and how it fits with neighboring topics. For multi-day reads on day 2+, frame the primer around what's still ahead.
- **Key concepts** — 3–5 bulleted vocab items with a one-line definition each. These are the words the user should be able to say back by end of day.
- **Watch for** — 1–2 specific things to pay attention to that the casual reader misses (a trade-off, a deliberate "wrong" first design, a sibling-pattern contrast, an author qualification of a strong claim).
- **Excerpt** — for repo topics: a verbatim 2–4 line quote from the linked README, picked for the load-bearing idea. For Head First chapters: a verbatim quote from the **repo's secondary-reference README** for the same pattern (do NOT fabricate quotes from the book — you don't have it).

If the user is on `demo` or `implement` step (not `read`), shift the Reading material to be about the demo file or homework respectively — keep it grounded.

#### B. Step task

- **read**: "Continue reading `<topic>/README.md` (or Head First Ch N) for ~30–60 minutes. Capture 3–5 takeaways in Notes. If you finish the read, advance the step in state.md before tomorrow's run."
- **demo**: "Type out `<demo file>` yourself (don't paste). Run it, predict output, modify one thing, note what broke or surprised you."
- **implement**: "Do `<topic>/homework.md` (or chapter exercises). Hit each Done-when checkbox. Write a one-paragraph retro."

#### C. Apply task

A small, concrete coding exercise (~10–30 lines) that uses the day's concept in a different setting from the README/demo. Must reference a concrete output: file path, line count, expected behavior. Examples:
- `read` day on Strategy: "Type a 15-line example where a `Sorter` class has a swappable `compare` strategy. Run it with two different strategies."
- `read` day on Observer: "Type a 20-line `EventBus` with subscribe/emit. Subscribe two listeners, emit one event, see both fire."
- `read` day on `separation-of-concerns`: "Take any 30-line script you've written that mixes I/O and logic. Split it into a pure function + a thin I/O wrapper."

Save apply work to `<repo_root_for_subject>/_solutions/applied/<topic>/<YYYY-MM-DD>.<ext>`:
- agentic-workflows → `agentic-workflows/_solutions/applied/...`
- architecture, design-patterns, and other software-engineering areas → `software-engineering/_solutions/applied/...`

#### D. Prove-it questions

2–3 questions grounded in today's content, answered in writing in Notes. Avoid generic prompts. Question shapes that work:
- "In your own words, what problem does X solve that Y doesn't?"
- "Name a place in code you've written where X is hiding under a different name (e.g., 'policy', 'handler', 'provider')."
- "If you had to explain X to a junior dev in 60 seconds, what would you say?"
- "What's the trade-off the author identified between X and Y? Do you agree?"
- "X and Z look similar in UML — what's the intent difference?"

For `demo` days: questions probe what changing the demo taught you. For `implement` days: questions probe what trade-offs you made in the homework.

### Step 6 — Decide task count

Default: **2 checkbox tasks per subject** (one step + one apply). Comprehension questions are NOT checkboxes — they're inline prompts answered in Notes.

Bump to 3 tasks for a single subject only if `implement` step has many "Done when" boxes that genuinely split. Never exceed 3 tasks per subject. Cap total at 8.

### Step 7 — Write the output file

Use Write (the file must not exist; Step 1 guaranteed that). Template:

```markdown
# YYYY-MM-DD — Daily todo[ — focused: <area1>, <area2>]

## Yesterday (YYYY-MM-DD)

<one short paragraph about prior day, OR "Sprint starting — no prior day.">

---

## <Subject> — Level <N> (<level name>)[ — Head First Ch <N>]

**Topic:** `<topic>` (#<index> in level) — step: `<read|demo|implement>`
[**Pattern(s):** <pattern names> — design-patterns only]
[**Running example:** <example> — design-patterns only]

**Files:**
- Master syllabus: [progress/<subject>/SYLLABUS.md](../<subject>/SYLLABUS.md)
- README: [<path>/README.md](../../<path>/README.md)
- Demo: [<path>/<demo file>](../../<path>/<demo file>)
- Homework: [<path>/homework.md](../../<path>/homework.md)
- (additional links per subject — see existing examples)

**Reading material — orient yourself before opening the linked README:**

> _Primer:_ <4-6 sentences>

> _Key concepts you'll meet:_
> - **<term 1>** — <one-line definition>
> - **<term 2>** — <one-line definition>
> - **<term 3>** — <one-line definition>

> _Watch for as you read:_ <1-2 specific things>

> _Excerpt (verbatim from the README/repo reference):_
> > <2-4 line literal quote>

**Today:**
- [ ] **Step:** <step task>
- [ ] **Apply:** <apply task — file path, line count, expected behavior>

**Prove it — answer in Notes:**
1. <grounded question 1>
2. <grounded question 2>
3. <grounded question 3 — optional>

---

(repeat per subject)

---

## Notes

_(Free space — answer the "Prove it" questions here, jot insights, blockers, things to revisit.)_

### <Subject 1> — answers

1.
2.
3.

(per-subject answer subsections)
```

For untracked areas in discovery mode, additionally include this callout above the Files block:

```markdown
> **Untracked area** — `<area>` doesn't have `progress/<area>/state.md` or `SYLLABUS.md` yet. The skill picked the first topic in `<area_path>/01-.../<first-topic>/` as a starting point. To track this area as a sprint subject, ask me to create the syllabus and state files.
```

Important details:

- All file links are RELATIVE FROM `progress/YYYY-MM-DD/`. Master-syllabus links use `../<subject>/SYLLABUS.md`; repo-content links use `../../<path>`.
- Only include link lines for files that actually exist.
- For external topics: drop README/Demo/Homework lines and replace with a `Resource:` line quoting the syllabus deliverable. The Step task IS the deliverable. Apply task is still required.
- Reading-material excerpts must be VERBATIM from the linked file. Do not paraphrase. Do not invent quotes from books you don't have access to.
- Prove-it questions must be GROUNDED — specific to today's content, not boilerplate.

### Step 8 — Report to the user

Show:
- Path to the new file.
- For each subject: level + topic + step (one line).
- Total task count + total question count.
- One-line reminder: check boxes off as you go; answer the Prove-it questions in Notes; advance `state.md` when a topic's `implement` is done (or a step is finished and you're ready to move on) — or ask this skill to do it.

## Multi-day topics

A topic spans multiple days. The skill does NOT track "day in step" — it just keeps producing same-step tasks until you advance state. On a multi-day `read`, vary the apply task each day (use yesterday's notes to pick a fresh angle).

## Advancing state

This skill does NOT auto-advance `state.md`. The user advances it (or asks). When asked to advance a tracked subject:

- Within a topic: bump `Next step`: `read` → `demo` → `implement`.
- After `implement` is done:
  - If there's a next topic in the same level: increment `Topic index in level` by 1, reset `Next step` to `read`, look up the new topic from the master syllabus and update all topic fields. Update `Last completed`.
  - If that was the last topic in the level: bump `Level` by 1, reset `Topic index in level` to 1.
  - If that was the final row: congratulate, mark "syllabus complete," ask whether to start a new sprint or pick external goals.

When advancing, ALWAYS re-read the master syllabus to pull the next topic — don't infer from memory.

## Bootstrapping a new tracked subject (when the user asks)

If the user asks to track a new area that's in the registry but currently untracked:
1. Create `progress/<area>/SYLLABUS.md` modeled on the existing three syllabuses (4 levels, beginner → expert; pull topics from the area's actual repo subdirs in numeric order).
2. Create `progress/<area>/state.md` starting at Level 1, index 1, step `read`, pointing at the first topic.
3. Confirm with the user that the auto-generated syllabus matches their intent before they sprint on it.

## What this skill does NOT do

- Doesn't accept area names not in the registry.
- Doesn't grade homework or check correctness.
- Doesn't skip ahead or reorder topics within a syllabus.
- Doesn't exceed 8 tasks per day or 3 tasks per subject.
- Doesn't overwrite an existing day's output file — that day's plan is locked once written.
- Doesn't auto-advance state — the user owns that decision.
- Doesn't fabricate excerpts from books or files it hasn't actually read.
- Doesn't generate generic comprehension questions — every question must be specific to today's topic content.
