# Homework — System Prompt Anatomy

> Dissect a real prompt. Spot what's missing. Refactor it.

## Exercise 1: Anatomize a real prompt

Pick one prompt from your environment — preferably one of the `.claude/agents/*.md` files in this repo (e.g., `.claude/agents/security-reviewer.md`). Or use a system prompt from another project you've worked on.

For that prompt:
- Identify each of the 7 sections (role, goal, capabilities, rules, output format, examples, edge cases).
- Note which sections are present, missing, or implicit.
- Explain (one line each) why a missing section may or may not matter for that specific agent.

**Constraint:** This is reading-and-analysis, not vibing. Mark literal section boundaries.

## Exercise 2: Refactor a flat prompt

Take any prose-only prompt (1–2 paragraphs of run-on instructions). Refactor it into the 7-section anatomy.

**Constraints:**
- Each section labeled with a clear heading.
- Every "MUST" / "MUST NOT" rule is in section 4 (operating rules), not buried in the role section.
- Output format is structured (schema or example), not free-text described.
- Add at least one explicit edge case to section 7.
- Total length should not be dramatically larger; structure is rearrangement, not bloat.

## Exercise 3: Build a prompt library

Create three reusable blocks and compose two agents from them:

```
prompts/
├── blocks/
│   ├── role-research.md
│   ├── role-review.md
│   ├── rules-cite-everything.md
│   ├── rules-no-edits.md
│   └── output-json-issues.md
└── agents/
    ├── security-reviewer.md   (composed from blocks)
    └── research-summarizer.md (composed from blocks, mostly different)
```

**Constraints:**
- The two final agents share at least 2 of the 5 blocks.
- A block edit (e.g., adding a rule to `rules-cite-everything.md`) should propagate to both agents on the next build.
- Document the build/composition step (a `Makefile`, a `compose.js`, or a README explaining the convention).

## Stretch: Diff-friendly versions

Add a version line at the top of each block (`<!-- version: 1.2 -->`). When you change a block:
- Bump the version.
- Note the change in a `CHANGELOG.md`.
- Run a regression test (your eval set from the previous topic) before committing.

## Reflection

- Order matters. Why is "rules" usually placed *after* "capabilities" but *before* "output format"? (Hint: the model needs to know what tools exist before being told how to use them.)
- "Don't make the prompt a god-document." When does a prompt that follows the 7-section anatomy become bloated? (Hint: examples that grow; edge cases that proliferate.)
- A prompt that has only sections 1, 4, 5 (role + rules + output) is often enough. When would you skip the rest?

## Done when

- [ ] You can take any prompt and label its sections in 30 seconds.
- [ ] You have at least one prompt in your repo built from reusable blocks.
- [ ] A block edit propagates to two or more agents.
- [ ] You can argue for or against having an "examples" section in any specific prompt.
