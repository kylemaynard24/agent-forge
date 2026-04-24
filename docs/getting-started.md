# Getting started

This doc covers the mental model for Claude Code: what it is, what the primitives are, and how to start building with it.

## What Claude Code is

Claude Code is Anthropic's CLI agent. You run `claude` in a terminal, it opens an interactive loop, and the model uses tools (Read, Edit, Bash, Grep, etc.) to do real work in your repo. Same agent ships as a CLI, a desktop app, a web app (claude.ai/code), and IDE extensions.

The important idea: **Claude Code is not just a chat window.** It reads files, runs commands, edits code, spawns subagents, and executes hooks. Everything you customize is aimed at shaping that loop.

## The core primitives

There are six things you can build or configure:

1. **Settings** — `settings.json`: model, permissions, env vars, hooks
2. **Agents** (subagents) — specialists invoked via the `Agent` tool
3. **Slash commands** — named prompt templates (`/review`, `/deploy`)
4. **Skills** — capabilities the model loads itself when relevant
5. **Hooks** — shell commands the harness runs on events
6. **MCP servers** — external tool providers (Slack, databases, etc.)

Each has its own file layout and its own doc in this folder.

## The `.claude/` folder

Customizations live in two places:

- `~/.claude/` — **user scope**, applies to every project on your machine
- `<repo>/.claude/` — **project scope**, committed to git and shared with the team

Both directories support the same subfolders: `agents/`, `commands/`, `skills/`, `settings.json`. Project-level files win when names collide.

**Rule of thumb:** put anything team-shared in `<repo>/.claude/`; put your personal shortcuts in `~/.claude/`.

## Permission modes

When Claude tries to run a tool that isn't auto-approved, you get a prompt. You control this four ways:

| Mode | What it does |
| --- | --- |
| Default | Prompts for anything not pre-allowed |
| `auto-accept edits` | Edits auto-approve; other tools still prompt |
| `plan mode` | Read-only; Claude researches and proposes, can't edit (see [plans.md](plans.md)) |
| `bypass permissions` | Runs everything without asking — use sparingly |

Toggle with `Shift+Tab`. Pre-allow specific tools/commands in `settings.json` under `permissions.allow`.

## CLAUDE.md

Drop a `CLAUDE.md` at the repo root (or in any subfolder). Claude reads it automatically every session. Use it for:

- Project conventions ("we use pnpm, not npm")
- Commands ("run `pnpm test:unit` before claiming tests pass")
- Context that can't be inferred from the code ("the `legacy/` folder is being removed Q3")
- Warnings ("never run migrations against prod-shadow")

Keep it short. It's in your context on every turn — every line costs tokens. A nested `CLAUDE.md` inside a subfolder only loads when Claude is working there.

## Your first customization

The cheapest primitive to start with is a slash command. Create `.claude/commands/hello.md`:

```markdown
---
description: Test slash command
---
Say hello and tell me what repo we're in.
```

Then type `/hello` in Claude Code. That's the whole loop: **file → frontmatter → body → invoke.** Every other primitive in this folder is a variation on that pattern.

## What to read next

- Making specialists → [agents.md](agents.md)
- Researching before coding → [plans.md](plans.md)
- Coordinating multiple agents → [panels.md](panels.md)
- Reusable prompts → [slash-commands.md](slash-commands.md)
- Auto-loaded capabilities → [skills.md](skills.md)
- Automating harness behavior → [hooks.md](hooks.md)
