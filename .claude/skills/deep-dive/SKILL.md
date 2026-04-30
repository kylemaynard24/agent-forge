---
name: deep-dive
description: Use when the user wants more depth on a topic than the current README/syllabus provides — appends substantive new sections (worked examples, edge cases, common practitioner mistakes, sibling-pattern comparisons, FAQs, real-world case studies, recommended reading) to the topic's README in a clearly-marked dated section. Accepts an optional focus area or question; otherwise picks one well-chosen angle. Designed for grounded, citation-where-relevant content — not summaries of what the README already says.
---

This skill is a learning amplifier. The user has already read a README (or chapter, or doc) and wants to go further on a specific angle that the source material under-covered. The skill writes that deeper content directly into the file the user is reading from, so the deepening accumulates over time.

## When to invoke

- User says "deep dive on X" / "I want more on X" / "explain Y in more depth" / "what about edge case Z?"
- User invokes `/deep-dive` from inside their daily-tasks workflow (e.g. while reading today's topic and wanting more)
- User asks a comprehension question that the linked README doesn't fully answer

## When NOT to invoke

- User wants a quick verbal answer in conversation — just answer; don't modify a file.
- User wants a brand-new topic added to a syllabus — that's a syllabus edit, not a deep-dive append.
- User wants the daily todo extended — that's the `daily-tasks` skill, not this one.

## Inputs

The skill accepts free-form arguments:

- **A path** (`/deep-dive agentic-workflows/01-foundations/what-is-an-agent/README.md`) — operate on that file.
- **A topic name** (`/deep-dive what-is-an-agent` or `/deep-dive Bicep modules`) — resolve to the right file via the syllabuses + repo structure.
- **A focus area** (`/deep-dive what-is-an-agent: how do I size the toolset?`) — colon separates topic from focus.
- **No args** — auto-detect today's read-step topic across the four daily-tasks subjects; if multiple subjects are on `read`, ask which.
- **Just a focus area, no topic** — assume today's topic.

## Run order

### Step 1 — Resolve target file

| Topic source | Target file |
|---|---|
| Repo content topic (agentic-workflows, architecture, design-patterns) | The topic's own `README.md` (append in-place) |
| Head First chapter (design-patterns) | `learning-syllabuses/deep-dives/design-patterns/headfirst-ch<N>-<short>.md` (create if missing) |
| DevOps topic | `learning-syllabuses/deep-dives/devops/<topic-slug>.md` (create if missing) |
| Topic the user names but the skill can't locate | STOP and ask — don't invent a path |

For repo READMEs, the deep dive is appended IN-PLACE — but always in a clearly-marked dated section so the original content stays visible and the user can git diff to see what was added.

For external topics (devops, Head First) that don't have a single canonical README, the deep dive lives in a dedicated file under `learning-syllabuses/deep-dives/`. This keeps the syllabuses clean and accumulates depth in one discoverable location.

### Step 2 — Read the source + related context

Read the target file in full. Then read enough surrounding context to write something useful:

- For repo topics: read the topic's `demo.<ext>` and `homework.md` if they exist, and the syllabus row referencing this topic.
- For Head First chapters: read the repo's secondary-reference pattern README (e.g., `software-engineering/design-patterns/behavioral/strategy/README.md` for Ch 1), and the chapter's row in `learning-syllabuses/design-patterns.md`.
- For devops topics: read the row in `learning-syllabuses/devops.md` (the Deeper-reading column has good signal).
- ALWAYS check whether a previous deep dive already exists in the target file and read those sections too — the new content should NOT repeat what previous deep dives already covered.

### Step 3 — Pick a focus

If the user provided a focus area, use it.

If not, identify ONE focus by scanning the source for under-covered angles. Good signals:
- A trade-off the README mentions in one sentence but doesn't unpack
- A "watch out for" caveat the README hints at but doesn't explain
- A comparison-with-sibling-concept the README doesn't draw out (e.g., Strategy vs State, App Service vs Container Apps)
- An obvious production failure mode the README doesn't address
- A nuance that distinguishes practitioner-level from beginner-level understanding

Don't try to cover everything. **One focused deep dive > a sprawling expansion.** Mention 2-3 other angles you considered but didn't pick — the user can run the skill again for those.

### Step 4 — Write the deep-dive content

Aim for **500–1500 words** of substantive prose. Not bullet lists; prose that earns its space by teaching something the source didn't.

Choose 2–4 sections from this menu (don't write all of them — pick what fits the focus):

- **Worked example** — a concrete scenario walked through end-to-end, often with pseudocode or short code. Show the reasoning at each step, not just the answer.
- **Common practitioner mistakes** — what experienced engineers regularly get wrong when applying this concept, and why the mistake feels right at the time.
- **Edge cases and gotchas** — boundary conditions, race conditions, scaling limits, failure modes the README skips.
- **Sibling-concept comparison** — Strategy vs State, App Service vs Container Apps, Decorator vs Proxy — when they look similar, what their *intent* difference is, and how to pick.
- **Production case study** — a fictional-but-realistic scenario showing how this concept plays out at scale, with the trade-offs that emerge.
- **FAQ** — 3-6 short Q&A pairs on questions practitioners commonly ask. Useful for quickly answering follow-on doubts.
- **Anti-patterns** — concrete code or design shapes that masquerade as the concept but aren't, with diagnostic signals.
- **Where to read further** — 2-5 specific citations (book chapters, papers, talks, doc pages). Always specific — never just "read more about X."

### Step 5 — Append the section

Use Edit to append to the target file. Template:

```markdown

---

## Deep dive: <focus area> — <YYYY-MM-DD>

> Generated by `/deep-dive` skill. Original content above is unchanged. To go further, run `/deep-dive` again with a different focus.
>
> **Other angles considered but not covered today** (run again to get any of these): <2-3 named angles>

### <Section 1 title>

<prose>

### <Section 2 title>

<prose>

### <Section 3 title — optional>

<prose>

### Where to read further

- <citation 1 — specific>
- <citation 2 — specific>
```

If the file doesn't exist (external-topic case), Write it with a header that links back to the source:

```markdown
# Deep dive: <topic name>

> A growing collection of deep dives on `<topic>`. Source: <link to syllabus row or canonical doc>.

(then the dated deep-dive section as above)
```

### Step 6 — Report to the user

- Path to the modified file
- Word count of the new section
- The 2-3 unselected angles, named
- One-line: "Run `/deep-dive <topic>: <angle name>` to expand any of those next."

## Hard constraints

- **Never rewrite the original README content.** Only append. The original author's voice stays intact; the user can git diff to see exactly what changed.
- **Never invent quotes from books.** The repo design-patterns family already enforces this for Head First — same rule everywhere.
- **Cite specifically.** "See chapter 3 of *Designing Data-Intensive Applications* (Kleppmann)" is useful; "read more about distributed systems" is not.
- **Don't overwrite previous deep dives** in the same file — append a new dated section.
- **Don't drift from the focus.** A 1500-word deep dive that wanders is less useful than a 500-word one that nails one angle.
- **No marketing prose, no filler, no recap of the source.** Every paragraph should teach something the source didn't.

## What this skill is good for (concrete examples)

- "I read about Strategy but I want to see how it interacts with the open/closed principle in real code." → worked-example focus.
- "Bicep modules — I want a concrete example of when modules become an anti-pattern." → anti-patterns + edge-cases focus.
- "I keep confusing Decorator and Proxy." → sibling-comparison focus.
- "What does Observer look like at scale — say 10,000 subscribers?" → production-case-study + edge-cases focus.
- "Give me an FAQ for `what-is-an-agent` — I have a list of questions in my head." → FAQ focus, then user can run again with specific questions.
