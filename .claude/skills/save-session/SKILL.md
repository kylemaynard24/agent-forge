---
name: save-session
description: Use to snapshot the current working context to a markdown file — what the user is doing, the actions taken in this session (chronologically), what's in flight, and what's next. Useful for picking up later (you OR a future Claude session can read the snapshot to recover context) and for sharing what you worked on with collaborators. After the snapshot is written, optionally also generates or updates a README. Saves to progress/sessions/<timestamp>-<slug>.md.
---

This skill writes a structured snapshot of the **current conversation's working context** to a file. The point is **context recovery** — if the conversation ends, the user comes back tomorrow, or a different person picks up the work, the snapshot tells them where things stand without making them re-read the whole conversation.

## When to invoke

- User says "save the session" / "snapshot this" / "save context" / "write up where we are"
- After a significant chunk of work, when the user wants to checkpoint before moving on
- Before starting a long-running task you'll come back to
- When the user is about to step away and wants a written record they can refer back to

## When NOT to invoke

- For trivial single-question conversations — there's nothing useful to snapshot.
- As a substitute for committing code — `save-session` documents the *thinking*, git documents the *changes*. Both belong in their proper place.
- For things better off in `auto-memory` — long-lived facts about the user (preferences, role, project structure) belong in memory, not in session snapshots that decay.

## Inputs

The skill accepts optional free-form arguments that become the session focus / title:

- `/save-session` — auto-detect focus from recent context.
- `/save-session "Refactoring daily-tasks into next-sprint + slice"` — use the provided text as the session focus.

## Run order

### Step 1 — Resolve filename

Today's date + current local time → `YYYY-MM-DD-HHMM`. Combine with a short slug (3–6 words, kebab-case) summarizing the session focus. Final path:

```
progress/sessions/<YYYY-MM-DD-HHMM>-<slug>.md
```

Examples:
- `progress/sessions/2026-05-01-1430-csharp-track-expansion.md`
- `progress/sessions/2026-05-01-0900-sprint-refactor.md`

If the user passed an explicit focus argument, derive the slug from it. Otherwise, derive from the last few user messages or the dominant work in recent tool calls.

If a file with the same timestamp already exists (rare — same minute), append a letter: `...0900a.md`, `...0900b.md`.

Create the `progress/sessions/` directory with `mkdir -p` if it doesn't exist.

### Step 2 — Gather context

Before writing the snapshot, run these in parallel to build accurate context (don't write fiction — ground in real artifacts):

- `git log --oneline -20` — recent commits this session may have produced
- `git status` + `git diff --stat HEAD` — uncommitted changes
- `git diff --stat HEAD~5..HEAD` — what changed in recent commits
- List recent files modified by you in this session (you have this in conversation context — use it)
- The user's most recent messages — what they were asking for or pushing back on

Pull what's REAL, don't infer. If you can't tell what the focus was, ask the user via AskUserQuestion before generating.

### Step 3 — Write the snapshot

Use Write. Template:

```markdown
# Session — <focus title>

**When:** <YYYY-MM-DD HH:MM> (local time)
**Branch:** <git branch>
**Last commit at session save:** <short SHA> · <commit subject>

## TL;DR

<2-3 sentences: what was accomplished, what's the headline outcome. Read this first; the rest is detail.>

## Actions taken (chronological)

A summary of the actions taken in this session, in roughly the order they happened. This is the spine of the snapshot — the rest of the sections add interpretation.

1. **<action 1>** — <one-line description>. <link to commit SHA, file, or PR if applicable>.
2. **<action 2>** — <description>.
3. **<action 3>** — <description>.

(Aim for 5–15 entries. Each is a discrete, verifiable thing that happened — a commit, a file written, a decision reached, a tool call sequence, an exchange that resolved a question. Don't pad; if the session was small, the list is short.)

## What we were working on

<2-4 sentences: the goal of this session in plain language. What was the user trying to accomplish? What was the framing?>

## Decisions made

<bulleted list of judgment calls or trade-offs made. Each one names the alternative considered and why this path won.>

- **<decision>** — chose X over Y because <reason>.

## In flight (not yet done)

<work that was started but didn't finish. Be specific so the next session can pick up.>

- <pending item — what's left, what file, what's blocking>

## What's next

<2-4 concrete next steps. Not vague — name files, commands, decisions to make.>

1. <step>
2. <step>

## Useful pointers

<links to specific files, commits, or external resources that the next session will want to read first.>

- [<file/path>](<path>)
- Commit `<sha>` — <one-line description>

## Open questions / blockers

<any unresolved questions, decisions waiting on external input, things you'd want to ask the user about when picking back up.>

- <question or blocker>

## Notes

<free space — anything else worth capturing that doesn't fit the above sections. Optional.>
```

### Step 4 — Be honest about scope

Cover only what genuinely happened in THIS conversation. Don't invent past sessions, don't fabricate decisions you can't point to in the conversation history, don't speculate about what the user "probably wants." If something is truly unknown, say so in "Open questions" rather than guess.

### Step 5 — Offer to also generate / update a README

After the snapshot is written, ask the user via `AskUserQuestion` whether to also generate a README:

- **Question:** "Snapshot saved. Also generate or update a README based on this session?"
- **Options (multiSelect: false):**
  - `no_readme` (recommended) — Just the snapshot. The session-snapshot file is enough for context recovery.
  - `new_readme_alongside` — Generate a separate README alongside the snapshot at `progress/sessions/<timestamp>-<slug>-README.md`. Use when the session built something concrete and you want a sharable explainer.
  - `update_existing` — Update an existing README somewhere in the repo. The skill will ask which path. Use when the session significantly changed a feature/skill and the existing README needs the update.

If `no_readme`: stop after the snapshot.

If `new_readme_alongside`: write a separate README file. The README is shaped for **the future reader who hasn't seen this session** — it explains what was built, why, and how to use it. Format:

```markdown
# <thing built or topic>

## What this is

<2-3 sentences: what was created or changed in this session. Plain-language for someone who didn't see it built.>

## Why it exists

<the problem or need that motivated the work, framed so a new reader gets the context.>

## How to use

<concrete usage instructions: commands to run, files to read first, settings to know about. Be specific.>

## What's notable

<2-3 design choices worth flagging — trade-offs accepted, alternatives rejected, gotchas to know about.>

## Where to read more

<links to the session snapshot, relevant code, related docs.>
```

If `update_existing`: ask via a second AskUserQuestion which README path to update. Read it first; then add a new "## Update — <date>: <session-focus>" section near the top with the relevant changes. Never replace existing content; append the section.

### Step 6 — Report to the user

Show:
- Path to the new snapshot file.
- Path to the README if one was generated/updated.
- One sentence: what the snapshot covers.
- Suggestion: "If you'd like to commit these to the repo so a future session can read them, run `git add progress/sessions/<file>.md` and commit. (I won't commit automatically — these are sometimes too noisy to preserve.)"

## Storage location

`progress/sessions/<YYYY-MM-DD-HHMM>-<slug>.md`. Tracked by git **by default** because:
- Future you on a different machine can read past snapshots.
- Friends sharing the repo can see your working history.
- Snapshots accumulate as a record of how the project evolved.

If a particular snapshot has sensitive info (debug output with secrets, half-formed thoughts you don't want public), the user can manually `git rm --cached` it or move it elsewhere. Default is "preserve and share."

## What this skill does NOT do

- **Doesn't auto-commit.** The user decides whether a particular snapshot is worth committing. Some sessions are messy and the snapshot would just be noise; others are checkpoint-worthy.
- **Doesn't fabricate.** Every claim in the snapshot must be groundable in the conversation, the git history, or the file system. If you didn't see it happen, don't claim it.
- **Doesn't replace memory.** Long-lived user facts (role, preferences, repo structure) belong in `auto-memory`. Sessions are about THIS conversation's working state, which decays over time.
- **Doesn't snapshot the entire conversation verbatim.** It's a summary of working state, not a transcript. Two pages max for typical sessions.

## Recovering from a snapshot

A future Claude session can read a snapshot to bootstrap context: `Read progress/sessions/<file>.md`. The snapshot tells the new session: what the project is, what's in flight, what was just decided, and what's next — without re-reading the whole conversation history. This is the main payoff for taking the snapshot in the first place.
