# Skills

**Category:** Claude Code primitives

## What they are

A **skill** is a pre-defined capability profile — a *named bundle of instructions* the agent can invoke when the user wants that behavior. They live at `.claude/skills/<name>/SKILL.md` (or `~/.claude/skills/`).

Where slash commands are *one-shot prompts*, skills are *modular instructions* that can be:

- Loaded automatically when a triggering condition is met.
- Invoked explicitly (`/skill-name`).
- Combined with other primitives (e.g., a slash command that uses a skill).

## How they differ from slash commands

| | Slash command | Skill |
|---|---|---|
| Lifetime | One-shot prompt | Loaded as ongoing capability |
| Invocation | Explicit (user types `/name`) | Sometimes auto-triggered; can also be explicit |
| Scope | Affects the next prompt | Affects subsequent behavior in this session |
| Typical use | "Do this once" | "From now on, when X, behave like Y" |

A slash command teaches Claude something *for one prompt*. A skill teaches Claude something *for use whenever it's relevant*.

## Anatomy

Each skill is its own folder with at minimum a `SKILL.md`:

```
.claude/skills/test-first/
├── SKILL.md
└── (optional supporting files: examples, scripts, prompts)
```

`SKILL.md` has frontmatter and a body:

```markdown
---
name: test-first
description: When the user asks to add a feature or fix a bug, write a failing
  test BEFORE the implementation. Trigger on intent.
---

# Test-First skill

When applicable, follow this workflow:

1. Read the user's request.
2. If it implies new behavior or a bug fix:
   - First, write a failing test that captures the expected behavior.
   - Run the test, observe failure.
   - Then implement.
3. Otherwise, proceed normally.

Avoid this skill when the user explicitly says "no test" or for trivial
edits that don't change behavior.
```

The `description` is critical. It's how Claude decides whether to load the skill.

## What skills are good for

- **Workflows** — "Always create a branch before editing code." "Always confirm before destructive actions."
- **Style guides** — "When writing JS, prefer arrow functions. Use const, never var."
- **Capabilities that need ongoing state** — "Maintain a TODO list across this session."
- **Optional protocols** — "When the user says 'go deep,' use the test-first skill."

## What slash commands are good for instead

- One-off transformations.
- Per-prompt directives.
- Things that don't need to persist beyond the next response.

## Examples in this repo

The `.claude/skills/test-first/` directory in this repo is a real skill. You can read its `SKILL.md` to see how a production skill is shaped.

The user-level memory system (`~/.claude/projects/.../memory/`) referenced in CLAUDE.md is built on the skill primitive — there's an `auto memory` capability that loads relevant memories into context.

## Skill triggers

A skill is loaded when:

1. **The description matches the user's intent.** Claude reads the description and decides "this skill applies here."
2. **The user explicitly invokes it.** `/test-first start`.
3. **A hook triggers it.** Some skills are activated by harness events (less common).

The description is the prompt that decides #1. Write it sharply: when DOES this skill apply, when DOESN'T it?

## When to write a skill

- A behavior should activate **automatically** when relevant — not only on explicit user request.
- It needs to **persist** across multiple turns in a session.
- It's **modular** enough that you'd want to use it across multiple agents or commands.

## Anti-patterns

- **Skills as catch-alls.** A "general-purpose" skill that's loaded constantly is just system-prompt sprawl.
- **Skills that conflict.** Two skills with overlapping triggers fight for attention. Make triggers crisp and disjoint.
- **Skills with no constraint.** "Always be more careful" is empty advice. Specific behaviors only.

## Trade-offs

**Pros**
- Modular — capabilities ship as units.
- Auto-triggering — behavior kicks in when relevant.
- Composable — multiple skills can be active at once.

**Cons**
- Discoverability — users may not know which skills exist or when they fire.
- Conflicts — overlapping skills are confusing.
- Versioning — like prompts, skills can rot silently.

**Rule of thumb:** Write a skill when a behavior is bigger than one prompt and smaller than a custom agent.

## Real-world analogies

- A library function that's loaded only when needed: `import` it, use it; don't pay the cost when you don't.
- An employee skill ("certified in CPR") — activated by relevant situations, not all the time.

## Run the demo

```bash
cat ./demo/example-skill/SKILL.md
```

The demo is a real `SKILL.md` file you can adapt. It implements a "commit-message-policy" skill that activates whenever the user is about to commit.

## Deeper intuition

Primitives are the concrete handles the runtime gives you. They matter because production behavior is not shaped by prompts alone; it is shaped by where you package behavior, what gets reused, and which mechanisms stay implicit versus explicit.

The best way to study **Skills** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **Skills** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Subagents or Hooks:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **Skills** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
