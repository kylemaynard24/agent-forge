# Slash Commands

**Category:** Claude Code primitives

## What they are

A **slash command** is a custom prompt you save as a file. When you type `/<name>` in Claude Code, the file's body is injected into your conversation as if you'd typed it yourself. The model then follows those instructions.

It is the simplest, most underused agentic primitive. A slash command is a **named, version-controlled, reusable prompt** — a function call for Claude.

## Why they exist

Repeated work in Claude Code falls into patterns. "Write me a PR description from this branch." "Explain this file to me." "Run a multi-agent review of this PR." Without slash commands you re-type the prompt every time, drifting in wording and forgetting steps.

A slash command captures the prompt once. Now everyone on the team uses the same wording. The behavior is reproducible.

## File format

Slash commands live at:

- `.claude/commands/<name>.md` — project-scoped (committed to the repo).
- `~/.claude/commands/<name>.md` — user-scoped (your laptop only).

The file has optional frontmatter and a body:

```markdown
---
description: One-line description that appears in /help.
allowed-tools: Bash, Read, Edit
---

# Body of the command (any markdown)

This is the prompt that's injected into Claude's context when the user types
/the-command. Write it as if instructing Claude directly.

You can include placeholders for arguments. Use $ARGUMENTS for the raw text
the user typed after the command.
```

## Anatomy of a good slash command

1. **A description** — what the command does, in one line. Shows in `/help`.
2. **A clear directive** — the body is instructions to Claude, not a conversation. Use second person, action verbs.
3. **Steps when needed** — for multi-step commands, numbered steps work well.
4. **Constraints / guardrails** — what Claude should NOT do.
5. **Output format** — when the command produces an artifact, specify the shape.

## Examples in this repo

`.claude/commands/pr-desc.md`:

```markdown
---
description: Draft a PR description from the current branch's git state.
---

Inspect the current branch's diff against main. Produce a pull-request
description with:
- A 1-line subject (under 70 chars).
- A "Summary" section (3-5 bullets).
- A "Test plan" section.

Use git commands via the Bash tool. Do not modify any files.
```

`.claude/commands/review-crew.md` is more elaborate — it instructs Claude to spawn three subagents in parallel and synthesize their outputs (see `04-multi-agent-patterns/critic-reviewer`).

## When to write a slash command

You're a candidate for a slash command if you find yourself:

- Pasting the same paragraph of instructions into Claude regularly.
- Coaching teammates on "say it like this when you ask Claude."
- Wishing Claude would do a multi-step process the same way every time.

## When NOT to write one

- The task is one-off. A slash command for a 1-time prompt is overkill.
- The instructions change every time. A slash command captures *stability*, not exploration.
- The work is one tool call away. Just type the command directly.

## $ARGUMENTS — passing input

Slash commands can accept arguments. The user types `/explain api.py`; in the command body, `$ARGUMENTS` is replaced with `api.py`.

```markdown
---
description: Explain a specific file.
---

Use the explainer agent to walk through $ARGUMENTS.
```

## Composition: commands invoke agents, agents are not commands

A slash command is a *prompt template* run on the main Claude session. It can instruct the main session to spawn agents — but the command itself is not an agent.

Confusing this is the most common slash-command mistake:

- Don't put agent-like definitions ("you are a security reviewer…") in a slash command. That's an agent.
- Don't put commands in agent files; that's not how the harness loads them.

If you need a specialist with its own tool allowlist and context, use **agents** (next topic). If you need a reusable prompt for the main session, use slash commands.

## Trade-offs

**Pros**
- Captures prompt expertise in version control.
- Discoverable: `/help` lists them.
- Reproducible: every team member runs the same command.
- Composable: commands can invoke agents, hooks, skills.

**Cons**
- Stale commands silently rot — nobody runs them, the world changes around them.
- A repo with 30 slash commands is a discoverability problem.
- Slash commands run as the *main* session — they share that context.

**Rule of thumb:** Write a slash command after you've manually run the same prompt more than 3 times. Earlier than that and you're shooting in the dark; later and you've wasted typing.

## Anti-patterns

- **The kitchen-sink command.** A `/do-everything` that branches based on $ARGUMENTS. Split it.
- **The agent-in-disguise command.** "You are an X reviewer" inside a slash command. That belongs in `.claude/agents/`.
- **The unmaintained command.** A command nobody runs, doesn't reflect current practice. Delete it.

## Real-world analogies

- Shell aliases. `alias ll='ls -la'` is a one-line slash command for your shell.
- Macros in editors.
- Bookmarklets.

## Run the demo

```bash
cat ./demo/example-command.md
```

The "demo" for this topic is a real slash command file you can copy into `.claude/commands/`. Look at its structure; modify it; install it; run it.

## Deeper intuition

Primitives are the concrete handles the runtime gives you. They matter because production behavior is not shaped by prompts alone; it is shaped by where you package behavior, what gets reused, and which mechanisms stay implicit versus explicit.

The best way to study **Slash Commands** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **Slash Commands** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Subagents or Hooks:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **Slash Commands** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
