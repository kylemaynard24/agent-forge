# Capstone 05 — Developer Productivity Agent

## Context

The highest-leverage tools you can build are the ones you use every day. A developer productivity agent is a suite of Claude Code skills and hooks that reduce the friction cost of the most common engineering tasks: writing PR descriptions, creating design docs, capturing decisions as ADRs, summarizing what you worked on, explaining unfamiliar code, and running routine checks before a commit.

This capstone is meta: you are building the AI-powered engineering assistant that helps you do everything else in this curriculum faster and better. It is also directly practical — every skill you build in this capstone is immediately useful in your actual work.

This capstone is deliberately less architecture-heavy than the others. Its domain is the engineering workflow itself, and the skills are the deliverable. The primary discipline is agent design: designing tools that are clear, composable, and safe.

## Primary domains

| Domain | What this capstone exercises |
| --- | --- |
| `agentic-workflows` | Claude Code primitives (skills, hooks, settings), tool design, memory patterns, structured output |
| `engineering-career` | design docs, ADRs, behavioral storytelling, opinion articulation |

## What you'll build

A suite of Claude Code skills and hooks that you actually use in your daily engineering work. The suite evolves over the course of this curriculum — you add new skills as you encounter friction in your workflow.

**Core skills to build:**

1. `/pr-review` — reviews your own PR diff before submitting. Checks for missing tests, potential security issues, missing documentation, and common anti-patterns. Gives you 5 minutes of "second opinion" before you put it in front of teammates.

2. `/design-doc` — given a verbal description of a feature or system, generates a structured design doc following the format from `engineering-career/02-engineering-opinion/design-docs-and-rfcs/`. Asks clarifying questions for options you haven't specified. Saves to a designated location.

3. `/adr` — captures a decision as an Architecture Decision Record. Takes a decision description, generates the structured ADR format, and saves it to the ADR directory.

4. `/standup` — generates a standup summary based on your git activity since yesterday. Reads the commits, summarizes what changed, and formats it as a standup note. Optionally posts it somewhere.

5. `/onboard` — given a file, module, or directory path, explains what it does to a new engineer. Uses the codebase structure to provide context, not just the isolated file.

6. `/story-draft` — given a situation description, generates a draft behavioral story in STAR format for interview preparation. Saves to your story library.

**Hooks to build:**

1. Pre-commit hook that scans for exposed secrets and hardcoded credentials.
2. Pre-commit hook that checks that new test files follow the team's naming convention.
3. Post-session hook that appends a brief work log entry to a daily log file.

## Milestones

### Milestone 1: `/pr-review` skill (3-5 hours)
Build the PR review skill. It should read the current diff (or a specified diff), run at minimum three checks, and produce a structured report: findings with severity, file, and recommendation. Keep it honest — if the diff is clean, say so and explain why.

The hardest design question: what is this skill checking for that a human reviewer might miss? Answer this before writing the system prompt.

**Deliverable**: working skill. Run it on 3 real PRs (your own or public open source). An honest evaluation: what did it catch? What did it miss? What would you change?

---

### Milestone 2: `/design-doc` skill (3-5 hours)
Build the design doc generation skill. It should take a description (typed into the prompt or read from a file) and generate a structured design doc. Critically: it should identify missing information and ask for it before generating, not generate with obvious gaps.

Test it by giving it a deliberately vague description: "add authentication to the API." Does it ask the right clarifying questions? Does the generated doc match the structure from the `design-docs-and-rfcs/` topic?

**Deliverable**: working skill. Three generated design docs from three different prompts. An evaluation: what parts does the skill generate well vs. poorly?

---

### Milestone 3: `/adr` skill (2-3 hours)
Build the ADR capture skill. It should take a decision description and generate a properly formatted ADR. The ADR should include context, the decision, the options considered, and the consequences. It should save the ADR to a configured location with a sequential number.

**Deliverable**: working skill. Five ADRs generated from decisions you actually made during this curriculum. Review them: do they accurately capture your reasoning?

---

### Milestone 4: `/standup` skill (2-4 hours)
Build the standup summarization skill. It should read your git log since a configurable lookback window (default: yesterday), summarize the commits into plain-language work items, and format them as a standup note. It should handle both "I did lots of small commits" and "I did a few large commits" gracefully.

**Deliverable**: working skill. A week of generated standups. An evaluation: how accurately does it represent what you worked on? What context is missing from the git log that would make it better?

---

### Milestone 5: Hooks (2-4 hours)
Build the three hooks. The secret scanning hook is the most important — it should run on every pre-commit, scan staged files, and abort the commit if it finds patterns that look like credentials (API keys, passwords, private keys, connection strings with credentials embedded).

Test the secret scanner by deliberately staging a file with a fake credential pattern and verifying the hook catches it.

**Deliverable**: three working hooks. A test that confirms the secret scanner catches at least 5 common credential patterns.

---

### Milestone 6: Memory and context accumulation (4-6 hours)
Give the skills persistent memory. The `/design-doc` skill should know about ADRs you've already captured — it can reference them when generating new docs. The `/pr-review` skill should know about common issues in your codebase (from past reviews) and give them extra attention.

Design the memory model: what do the skills need to remember? Where is it stored? How is it updated? How is stale memory handled?

**Deliverable**: a design doc for the memory model. At least one skill that demonstrably produces better output because of accumulated context vs. without it.

---

### Milestone 7: `/onboard` skill (3-5 hours)
Build the onboard skill. It should explain a file, module, or directory to someone who has never seen it. It should: explain the purpose, describe the main components, identify the key entry points, and surface any non-obvious design decisions or constraints.

Test it by having a colleague use it on a part of the codebase they haven't worked in. Does the explanation give them enough to start contributing?

**Deliverable**: working skill. A test: find someone who hasn't seen a specific module and have them use `/onboard` on it. Report their feedback.

---

## Technical guidance

**Every skill is a tool contract**. Before writing the skill, write down exactly what inputs it accepts, what outputs it produces, and what it should refuse to do. This is the tool design exercise made real.

**Hooks need to be fast**. Pre-commit hooks run on every commit. If they take more than a few seconds, engineers start bypassing them. The secret scanner should be fast enough that it's invisible when it doesn't fire.

**The memory model is the hardest design problem in this capstone**. Persistent context that improves output over time is genuinely useful. But stale context that leads the agent astray is worse than no memory. Design the eviction and update strategy as carefully as the storage strategy.

**Build skills you will actually use**. The measure of success for this capstone is not how many skills you built — it is whether you are still using them in six months. Build fewer skills that you actually use, not more skills you test once.

## Skills to build while working on this capstone

This capstone is recursive: you're building skills while potentially using early versions of those skills to build later ones. Use `/pr-review` on your own skill code. Use `/design-doc` to write the design docs for your memory model. Use `/adr` to capture your design decisions.

## Further depth

- `agentic-workflows/03-claude-code-primitives/` — all of it; this capstone exercises every primitive
- `agentic-workflows/02-single-agent-design/tool-design-principles/`
- `agentic-workflows/02-single-agent-design/memory-patterns/`
- `engineering-career/02-engineering-opinion/design-docs-and-rfcs/`
