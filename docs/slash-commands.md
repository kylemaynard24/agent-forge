# Slash commands

A **slash command** is a named prompt template you invoke by typing `/name` in Claude Code. It's the cheapest primitive to build — think of it as a bash alias, but for prompts.

## File format

Commands live in `.claude/commands/<name>.md` (project) or `~/.claude/commands/<name>.md` (user).

```markdown
---
description: One-line summary, shown in the command picker
argument-hint: <pr-number>
allowed-tools: Bash, Read
---

The body is the prompt that gets injected when the user types /<name>.

You can reference $ARGUMENTS to use whatever the user typed after the command.
```

### Frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `description` | yes | Shown in the autocomplete picker |
| `argument-hint` | no | Placeholder shown after the command name |
| `allowed-tools` | no | Restricts tools for this command only |
| `model` | no | Force a specific model for this command |

All fields are optional except `description`. The simplest command is literally a description + a body.

## Arguments

If the user types `/deploy staging`, your body sees `staging` as `$ARGUMENTS`. You can also reference positional args: `$1`, `$2`, etc.

Example `.claude/commands/ticket.md`:

```markdown
---
description: Fetch and summarize a Linear ticket
argument-hint: <ticket-id>
---

Fetch Linear ticket $ARGUMENTS. Summarize it in 3 bullets:
- What the user wants
- What's blocking them
- The simplest viable fix
```

Invoked as `/ticket ENG-1234`.

## When to use a command vs. an agent

| Use a slash command when... | Use an agent when... |
| --- | --- |
| You want a reusable prompt in your current context | You want isolation (separate context) |
| The work is conversational and you want to stay in the driver's seat | The task is self-contained and returns a single result |
| You're packaging a workflow you find yourself retyping | You want parallelism or specialized tool sets |

They compose: a slash command can tell the main Claude to *invoke several agents* (that's how [panels](panels.md) are built).

## Shipping commands vs. personal commands

- `<repo>/.claude/commands/` — checked into git, shared with the team
- `~/.claude/commands/` — your personal shortcuts

Use project commands for workflows your whole team benefits from (`/review`, `/deploy-check`, `/update-changelog`). Use user commands for shortcuts only you use.

## A starter set worth copying

`.claude/commands/explain.md`:

```markdown
---
description: Explain a file or symbol in plain English
argument-hint: <path-or-symbol>
---
Explain $ARGUMENTS. What it's for, its main pieces, its dependencies,
and anything non-obvious. Cite path:line. Keep it under 200 words.
```

`.claude/commands/tdd.md`:

```markdown
---
description: Write a failing test for the described behavior, then implement
argument-hint: <behavior>
---
Write a failing test that exercises: $ARGUMENTS.

Then:
1. Show me the failing test and confirm it fails for the right reason.
2. Implement the smallest change that makes it pass.
3. Refactor if needed. Don't over-engineer.
```

`.claude/commands/pr-desc.md`:

```markdown
---
description: Draft a PR description from the current branch
---
Read the git log and diff for the current branch versus main. Produce a PR
description with: Summary (1–3 bullets), Why, Test plan (checklist). Don't
include anything that isn't grounded in the actual diff.
```

## Gotchas

- **Name collisions.** Project commands shadow user commands with the same name.
- **Commands don't have memory.** Each invocation is just prompt injection — no persistence between runs.
- **The frontmatter `description` is what the picker shows** — make it scannable.
- **Don't duplicate agent system prompts inside commands.** If the workflow has a specialist role, wrap it in an agent and have the command *invoke* the agent.

## Where to go next

- Combining commands and agents → [panels.md](panels.md)
- Auto-loaded capabilities (no typing required) → [skills.md](skills.md)
