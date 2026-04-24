# Agents (subagents)

An **agent** is a specialist you invoke with a task. It runs in its own context window, uses a defined tool set, and returns a single result message back to the caller. The main Claude Code session is the orchestrator; agents are the workers.

## When to use one

Use an agent when:

- The task needs a lot of file reading or searching and you don't want the noise in your main context
- You want an *independent* second opinion (a code-reviewer agent hasn't seen your analysis)
- Several subtasks are independent and can run in parallel
- A step is easier to retry/discard cleanly if isolated

Don't use one for a single file read or a grep — that's overkill and slower than just doing it.

## File format

Agents live in `.claude/agents/<name>.md` (project) or `~/.claude/agents/<name>.md` (user).

```markdown
---
name: migration-reviewer
description: Reviews SQL migration files for safety. Use when the user asks to audit, review, or sanity-check a migration before deploy.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a database migration reviewer. When invoked:

1. Read the migration file(s) in question.
2. Check for: missing indexes on FK columns, NOT NULL columns without defaults on large tables,
   destructive operations (DROP, TRUNCATE), long-running locks.
3. Report findings as a prioritized list: BLOCKER / WARNING / NIT.
4. If you see a BLOCKER, name the specific risk and the safer alternative.

Be terse. No preamble. Assume the reader knows SQL.
```

### Frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Unique identifier, kebab-case |
| `description` | yes | **The main Claude reads this to decide when to delegate.** Make it specific — include trigger phrases users might say |
| `tools` | no | Comma-separated allowlist. Omit = inherits parent's tools. Be stingy; fewer tools = fewer distractions |
| `model` | no | `opus`, `sonnet`, `haiku` — defaults to inherited |

### Body = system prompt

Everything below the frontmatter is the agent's system prompt. Treat it like you're onboarding a new hire: role, procedure, what good output looks like, what to skip.

## How invocation works

You don't call an agent directly by name. The main Claude chooses to delegate via the `Agent` tool when the task matches an agent's `description`. You can also steer it: *"Use the migration-reviewer agent on `0042_users.sql`."*

What the main Claude sends the agent:

- The description field is used for routing
- The body becomes the system prompt
- A one-shot task prompt (written by the main Claude) is the user message
- The agent gets its own context — **it doesn't see the main conversation**

So the task prompt needs to be self-contained. The main Claude knows this; your job is to make sure the agent's body is strong enough that even a terse task prompt produces good work.

## Gotchas

- **Agents are stateless across calls.** Each invocation starts fresh. Don't design workflows that assume memory between calls.
- **The description field is load-bearing.** If it's vague, the main Claude won't route to it. If it's overloaded ("does anything code-related"), it'll fire too often.
- **Tools cost context.** An agent with every tool loaded pays for the schemas on every turn. Allowlist what it actually needs.
- **Parallelism is free.** Multiple `Agent` calls in one message run concurrently. Use this for independent work (reviewing 5 files, drafting 3 variants).

## A minimal starter

Save as `.claude/agents/explainer.md`:

```markdown
---
name: explainer
description: Explains what a specific file, function, or module does. Use when the user asks "what does X do" or "walk me through Y".
tools: Read, Grep, Glob
---

Explain the target the user names. Read it end-to-end, then produce:

1. **One-sentence summary** — what it's for.
2. **Key pieces** — functions/classes/exports with one line each.
3. **Dependencies** — what it imports and why.
4. **Surprises** — anything non-obvious (hidden state, side effects, deprecated paths).

No code dumps. Cite line numbers as `path:line`.
```

Then: *"Use the explainer on `docs/plans.md`."*

## Where to go next

- Coordinating several agents at once → [panels.md](panels.md)
- Using agents as part of plan mode → [plans.md](plans.md)
