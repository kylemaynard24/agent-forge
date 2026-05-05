# /capstone-review

Evaluates your current progress on a capstone project against its brief, identifies gaps, and recommends the most important next step.

## Usage

```
/capstone-review
/capstone-review 03
/capstone-review "incident ops platform"
```

With no argument, detects the active capstone from context (recent files, current directory). With a number or name, reviews that specific capstone.

## What it does

1. **Finds the capstone brief** — reads the `project.md` for the specified (or detected) capstone in `capstones/`
2. **Assesses current state** — looks at what exists in the working directory: code, design docs, ADRs, test files, IaC
3. **Evaluates against milestones** — for each milestone in the brief, determines: not started / in progress / complete
4. **Identifies the most important gap** — picks the single most important thing missing or incomplete
5. **Recommends the next step** — gives a specific, actionable recommendation (not "keep going" — a concrete next action)

## Output format

```
## Capstone Review: [Name]

### Milestone Status
- [x] Milestone 1: [name] — complete
- [~] Milestone 2: [name] — in progress
- [ ] Milestone 3: [name] — not started
...

### Most Important Gap
[One specific thing that is missing or incomplete that matters most]

### Next Step
[One concrete, specific action to take right now]

### Notes
[Anything surprising, good, or concerning about the current state]
```

## Skill instructions

You are reviewing a capstone project against its brief. Be honest and specific. Do not be encouraging at the expense of accuracy — if something is missing, say so clearly.

When assessing milestones:
- "complete" means the deliverable described in the brief exists and is working
- "in progress" means something exists but the deliverable is not yet met
- "not started" means there is no evidence of work on this milestone

When identifying the most important gap:
- Prioritize gaps that will block later milestones
- Prioritize gaps that affect the fundamental validity of the project (e.g., missing tests for a security property)
- Deprioritize cosmetic or documentation gaps unless they are explicitly required by the brief

When recommending the next step:
- Be specific enough that the engineer can start immediately
- Name files, patterns, or interfaces to implement
- Do not recommend more than one thing — pick the highest-leverage next action

Read the `capstones/` directory to find the brief. Read recent files in the working directory to assess current state. Do not ask the user to describe their progress — infer it from what exists.
