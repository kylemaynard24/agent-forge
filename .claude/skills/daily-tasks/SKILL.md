---
name: daily-tasks
description: Use when the user wants their daily learning tasks. By default produces a plan covering four tracked subjects (agentic workflows, software architecture, design patterns, devops). Accepts area-name argument(s) to focus on a different repo learning area instead. Each subject's section includes inline reading material (primer + key concepts + watch-for + excerpt), a step task, an apply task, and 2 comprehension questions.
---

This skill produces one file per working day under `progress/<today>/`. Each subject's section includes:
- **Reading material** — a primer, key concepts, what to watch for, and a verbatim excerpt — so the user is oriented before opening the linked README or book.
- **Step task** — today's read/demo/implement work.
- **Apply task** — a small concrete piece to physically type and build.
- **Prove-it questions** — 2–3 grounded comprehension questions answered inline in Notes.

The day always ends with the user having read something, typed something, and proven they understood it.

## Area registry — the only valid areas

The skill **enforces** that any area name resolves either to a repo learning directory that exists on disk OR to a registered external-only subject (devops). The registry below is the authoritative list. To add a new area, the repo path must exist (or the area must be marked external-only with `progress/<area>/` set up).

| Area name | Repo path | External-only? | Tracked? (has progress/ state) | Notes |
|---|---|---|---|---|
| `agentic-workflows` | `agentic-workflows/` | no | yes (default) | 6-stage agent dojo; multi-day topics |
| `architecture` | `software-engineering/architecture/` | no | yes (default) | 8 sections, fundamentals → distributed systems |
| `design-patterns` | `software-engineering/design-patterns/` | no | yes (default) | Head First chapter order; multi-day chapters |
| `devops` | (none — Azure-shop tooling: Bicep, GitHub Actions, Azure resources/portal, Docker) | yes | yes (default) | All topics link to official docs; deliverables drive implement |
| `advanced-engineering` | `software-engineering/advanced-engineering/` | no | no | 6 sections: debugging, testing, perf, security, refactoring, incident response |
| `super-beginner-javascript` | `software-engineering/super-beginner-javascript/` | no | no | 12 sections, JS from values up through a mini-capstone |

When verifying a non-external area, confirm the **Repo path** exists on disk. For external-only areas (devops), skip the repo-path check; verify the `learning-syllabuses/<area>.md` exists instead. Do not invent areas; only accept registered names.

**Important: `progress/` is gitignored personal state.** Each user has their own `progress/` directory (it never gets pushed). The skill MUST gracefully bootstrap missing files — see "Bootstrapping personal progress" below.

The default plan is **capped at 4 subjects** (the four marked "default" above). Do not expand the default. The user explicitly chose 4 to keep daily load consistent — small consistent incremental improvements, not maximal coverage.

## Subjects, syllabuses, and state — for the four defaults

| Key | Master syllabus | State file |
|---|---|---|
| agentic-workflows | `learning-syllabuses/agentic-workflows.md` | `progress/agentic-workflows/state.md` |
| architecture | `learning-syllabuses/architecture.md` | `progress/architecture/state.md` |
| design-patterns | `learning-syllabuses/design-patterns.md` | `progress/design-patterns/state.md` |
| devops | `learning-syllabuses/devops.md` | `progress/devops/state.md` |

Each syllabus has 4 levels (Beginner → Expert). Topics span multiple days — the skill keeps producing same-step tasks until the user advances state.

## Run order

Today's date is `currentDate` from system context. Use ISO `YYYY-MM-DD`.

### Step 0 — Resolve which areas to plan for

Look at the user's invocation arguments (if any).

- **No arguments → default mode.** Subjects = `[agentic-workflows, architecture, design-patterns, devops]`. Output file: `progress/<today>/todo.md`.
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

In parallel, Read all syllabuses and state files for subjects in the resolved list.

**If a `progress/<subject>/state.md` is MISSING** (first-time user, fresh clone, friend bootstrapping): create it from the syllabus's Level 1 row 1. See "Bootstrapping personal progress" at the bottom. This is normal and expected.

For each subject:
- From state: `Level`, `Topic index in level`, `Next step`.
- From syllabus level table row #`Topic index in level`: topic name, repo path(s), running example (design-patterns only).

If state's path disagrees with the syllabus, trust the syllabus and note the correction in the todo. If the index exceeds the level's topic count, flag it loudly and ask the user to advance the level.

### Step 3 — Verify topic files (skip for external topics)

For repo paths starting with `agentic-workflows/` or `software-engineering/`:
- step `read` → README.md exists
- step `demo` → at least one `demo.*` file exists
- step `implement` → `homework.md` exists

For multi-pattern chapters (e.g., Head First Ch 4, 7, 9): verify each linked dir. Fall back to next available step if a needed file is missing. If the topic dir doesn't exist, surface as a blocker.

For external topics (entire devops subject + design-patterns Head First chapters + any external-marked rows in other syllabuses): skip file verification; the implement step uses the syllabus deliverable text directly. There is no README to excerpt.

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
- **Excerpt** — for repo topics: a verbatim 2–4 line quote from the linked README, picked for the load-bearing idea. For Head First chapters: a verbatim quote from the **repo's secondary-reference README** for the same pattern (do NOT fabricate quotes from the book — you don't have it). For **external-only topics (devops + any external row)**: omit the excerpt block entirely OR replace it with a "Doc reference" line naming the canonical doc section to read first (e.g., "Microsoft Learn — *Bicep fundamentals*, Module 1: 'What is Bicep?'") — never invent a verbatim quote from a doc you haven't actually read in this session.

- **Deep dive** (external-only topics only — REQUIRED for devops, optional for others): a 200–300 word substantive prose section that goes deeper than the primer and is meant to be read directly from the todo as actual learning material. Since the user can't click into a single authoritative README for these topics, the daily todo IS more of the reading. Cover: the conceptual model behind the topic (not just "what it is"), the most common mistake practitioners make, a concrete worked-through example (in prose, not code), and how this topic connects to the previous topic in the syllabus. Ground in real patterns — be specific about Azure / Bicep / Docker / GHA mechanics. Clearly title the block "_Deep dive:_". On a `read` day, this block is your main contribution to the user's reading depth; on `demo` and `implement` days, keep it but shift to focus on what they should look for as they execute.

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

Save apply work to **today's per-day work folder**: `progress/<today>/work/<subject>/<filename>`. The skill scaffolds this directory tree when generating today's todo (see Step 7). Examples:
- agentic-workflows → `progress/2026-04-30/work/agentic-workflows/tiny-agent.js`
- architecture → `progress/2026-04-30/work/architecture/before.js`, `.../after.js`
- design-patterns → `progress/2026-04-30/work/design-patterns/sorter-strategy.js`
- devops → `progress/2026-04-30/work/devops/portal-tour.md`

Per-day work folders are inside gitignored `progress/`, so artifacts stay local. If the user wants to keep something for later reference, they copy/move it out.

#### D. Prove-it questions

**Default 2 questions per subject** (was 3 — trimmed when the 4th subject was added to keep total ≤ ~8 questions per day). Bump back to 3 only when the user is in focused mode with ≤2 subjects in the plan, OR when the topic genuinely needs three angles to probe (rare).

Questions must be grounded in today's content, answered in writing in Notes. Avoid generic prompts. Question shapes that work:
- "In your own words, what problem does X solve that Y doesn't?"
- "Name a place in code you've written where X is hiding under a different name (e.g., 'policy', 'handler', 'provider')."
- "If you had to explain X to a junior dev in 60 seconds, what would you say?"
- "What's the trade-off the author identified between X and Y? Do you agree?"
- "X and Z look similar in UML — what's the intent difference?"

For `demo` days: questions probe what changing the demo taught you. For `implement` days: questions probe what trade-offs you made in the homework.

### Step 6 — Decide task count

Default: **2 checkbox tasks per subject** (one step + one apply). With the four default subjects, that's **8 tasks total** — at the cap. Comprehension questions are NOT checkboxes — they're inline prompts answered in Notes.

Do NOT bump to 3 tasks per subject in the default 4-subject plan — the user explicitly chose 4 subjects to keep daily load consistent and small. Only bump in focused mode (≤2 subjects) when an `implement` step has many "Done when" boxes that genuinely split. Never exceed 3 tasks per subject. Cap total at 8.

### Step 7 — Scaffold today's work folder + write the output file

Before writing the todo, create today's per-day work folder structure with `mkdir -p`:
- `progress/<today>/work/<subject>/` for each subject in the resolved list

Example (default 4-subject mode for 2026-04-30):
```
mkdir -p progress/2026-04-30/work/agentic-workflows progress/2026-04-30/work/architecture progress/2026-04-30/work/design-patterns progress/2026-04-30/work/devops
```

These directories are where Apply tasks save their artifacts. They start empty; the user fills them in as they work. The whole `progress/` tree is gitignored, so artifacts stay local — friends sharing the repo never see each other's scratch work.

Now Write the todo file (which must not exist; Step 1 guaranteed that). Template:

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
- Master syllabus: [learning-syllabuses/<subject>.md](../../learning-syllabuses/<subject>.md)
- README: [<path>/README.md](../../<path>/README.md)
- Demo: [<path>/<demo file>](../../<path>/<demo file>)
- Homework: [<path>/homework.md](../../<path>/homework.md)
- Today's work folder: `progress/<today>/work/<subject>/` (scaffolded; save apply work here)
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

> _Doc reference (external-only topics):_ <named canonical doc section>

> _Deep dive (external-only topics — REQUIRED for devops):_
>
> <200-300 word substantive prose: conceptual model, common mistake, worked-through prose example, connection to previous topic. Be specific about mechanics. This block IS the user's main reading on `read` days for external-only topics — make it earn the time.>

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

- All file links are RELATIVE FROM `progress/YYYY-MM-DD/`. Master-syllabus links use `../../learning-syllabuses/<subject>.md`; repo-content links use `../../<path>`. Today's work folder is at `work/<subject>/` (relative) — display in the todo as `progress/<today>/work/<subject>/` for clarity.
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

## Bootstrapping personal progress (first run on a fresh clone)

The `progress/` directory is gitignored — when a friend clones the repo and runs `/daily-tasks` for the first time, none of the personal state files exist. The skill must self-bootstrap silently:

For each subject in the resolved list:
1. If `progress/<subject>/` doesn't exist, create it with `mkdir -p`.
2. If `progress/<subject>/state.md` doesn't exist, create it from the Level 1 row 1 of `learning-syllabuses/<subject>.md`. Set `Level: 1`, `Topic index in level: 1`, `Next step: read`, `Last completed: (none yet — sprint starting)`. Pull topic name + path/resource from the syllabus.
3. Use the same state.md format as the existing tracked subjects (see any current `progress/<subject>/state.md` for the template).

Bootstrap silently — don't make the user confirm. Just note in the day's todo report which subjects you bootstrapped (so they know).

## Bootstrapping a new tracked subject (when the user asks)

If the user asks to add a NEW area to the registry (beyond the four defaults + the two recognized untracked areas):
1. Create `learning-syllabuses/<area>.md` modeled on the existing four syllabuses (4 levels, beginner → expert; pull topics from the area's actual repo subdirs in numeric order, or curate external resources for an external-only area).
2. Add the area to the registry table at the top of this skill file.
3. The next time the skill runs, it will auto-bootstrap `progress/<area>/state.md` per the previous section.
4. Confirm with the user that the auto-generated syllabus matches their intent before they sprint on it.

## What this skill does NOT do

- Doesn't accept area names not in the registry.
- Doesn't grade homework or check correctness.
- Doesn't skip ahead or reorder topics within a syllabus.
- Doesn't exceed 8 tasks per day or 3 tasks per subject.
- Doesn't overwrite an existing day's output file — that day's plan is locked once written.
- Doesn't auto-advance state — the user owns that decision.
- Doesn't fabricate excerpts from books or files it hasn't actually read.
- Doesn't generate generic comprehension questions — every question must be specific to today's topic content.
