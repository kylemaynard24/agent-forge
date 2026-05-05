# Homework — Subagents

> Build a specialist agent. Brief it well. Compare its output to what the main session would have produced.

## Exercise 1: Build a specialist

Pick a recurring task that benefits from a *focused* perspective. Examples:
- A `commit-message-reviewer` that audits proposed commit messages against your team's style.
- A `dependency-check` that audits a `package.json` for outdated/vulnerable deps.
- An `error-message-reviewer` for user-facing error strings (clarity, helpfulness).
- A `migration-reviewer` (see demo).

Build it as `.claude/agents/<name>.md`:

**Constraints:**
- Frontmatter has `name`, `description` (precise trigger), `tools` (allowlist — minimum needed).
- Body is a structured system prompt (role, task, what to check, output format, constraints).
- Output format is **structured** (JSON shape).
- Includes an explicit "what you do not do" section.
- The `description` triggers the agent only when intent matches.

## Exercise 2: Brief the agent well

Invoke your agent twice on the same task:

1. **Bad brief:** terse, command-style. ("Review this.")
2. **Good brief:** context, specific concerns, expected report shape, length cap.

Compare outputs. Note:
- How much guesswork the agent had to do under each brief.
- Whether the bad-brief output addressed your real concern.
- Token cost (often higher under bad briefs because the agent over-explores).

Document the lesson in 3 sentences.

## Exercise 3: Compare to no-subagent baseline

Run the same task against the main session (no subagent). Compare:

- Output quality.
- Context bloat (did the main session pollute itself with lots of intermediate reads?).
- Time / cost.

When the subagent helped, name what it bought you. When it didn't, articulate why a single agent was sufficient.

## Stretch 1: A pair of agents

Write two subagents whose outputs are designed to *disagree* productively. Example:
- An `optimist` agent ("what's right about this code?") and a `pessimist` agent ("what's wrong?").
- Spawn both in parallel. Synthesize. Did the disagreement reveal anything?

## Stretch 2: A nested agent

Have your subagent *itself* spawn a subagent. (You can do this if the agent's tool allowlist includes `Agent`.) Be cautious — nested agents can multiply costs unpredictably.

Document one case where this nested pattern was worth it.

## Reflection

- "A subagent is a fresh perspective — but only if you brief it like a smart colleague who walked into the room." Defend or refute.
- The `description` field decides when the harness offers your subagent. What's the difference between "useful for X" and "this is the X-er agent — call this for any X task"?
- A bad subagent prompt fails *quietly* — the report comes back, looks plausible, is wrong. How do you protect against this? (Hint: the next stage's evaluation work.)

## Done when

- [ ] You've written and used a real `.claude/agents/<name>.md`.
- [ ] You've experienced the difference between a bad brief and a good one.
- [ ] You've compared subagent vs no-subagent on the same task.
- [ ] You can articulate when to spawn a subagent and when not to.

---

## Clean Code Lens

**Principle in focus:** Single Responsibility + Precise Interface Contracts

A subagent's `description` field is both a dispatch key and a scope declaration — it tells the harness when to offer this agent and tells the agent itself what it is authorised to do. A vague description like "useful for code review" leaves both boundaries undefined: the harness may offer the agent too broadly, and the agent itself has no clear stopping point. A description like "reviews a single diff for security vulnerabilities and returns structured findings; does not suggest style changes or refactors" is a responsibility statement precise enough to audit against the output.

**Exercise:** Take your specialist agent's description and derive from it a list of three things the agent should do and three things it explicitly should not do. Add an explicit "What you do not do" section to the agent body if it doesn't already have one. Then check whether the agent's actual outputs ever cross a "should not" line — if they do, the description boundary needs tightening.

**Reflection:** You compared a bad brief ("Review this") to a good brief (context, concerns, output shape). Why does a vague brief produce a lower-quality output even when the agent's own system prompt is excellent — and what does that say about the relationship between a function's implementation and the quality of the arguments passed to it?
