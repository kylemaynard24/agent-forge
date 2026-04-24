# agent-forge docs

A working guide for building with Claude Code. Start at **getting-started**, then jump to whichever primitive you need.

## Contents

| File | What it covers |
| --- | --- |
| [getting-started.md](getting-started.md) | How Claude Code works, the core primitives, permission modes, the `.claude/` folder |
| [built-in-commands.md](built-in-commands.md) | Reference for every `/` command that ships with Claude Code, grouped by use |
| [agents.md](agents.md) | Creating subagents — file format, when to use them, invocation patterns |
| [plans.md](plans.md) | Plan mode — how it works, when to use it, writing prompts that produce good plans |
| [multi-agent.md](multi-agent.md) | Multi-agent orchestration — coordinating several agents over one project (what you were calling a "panel") |
| [panels.md](panels.md) | What "panel" actually means in the Claude ecosystem — the VS Code / Cursor sidebar UI |
| [slash-commands.md](slash-commands.md) | Custom `/commands` — the simplest way to package reusable prompts |
| [skills.md](skills.md) | Skills — named, auto-loaded capabilities the model can invoke on its own |
| [hooks.md](hooks.md) | Hooks — shell commands the harness runs on events (PreToolUse, Stop, etc.) |

## Where things live

```
~/.claude/                     user-scoped (applies to every project)
  agents/                      user subagents
  commands/                    user slash commands
  skills/                      user skills
  settings.json                user settings & hooks

<repo>/.claude/                project-scoped (checked into git)
  agents/
  commands/
  skills/
  settings.json                project settings
  settings.local.json          untracked, personal overrides
```

Project-level files override user-level files with the same name.

## Quick mental model

- **Agent** → a specialist you *invoke* with a task (runs in its own context, returns a result)
- **Plan** → a *read-only research-then-propose* workflow before you touch code
- **Multi-agent orchestration** → one session fans out to several specialist agents, then synthesizes
- **Slash command** → a named prompt template you type (`/foo`)
- **Skill** → a capability the model loads *itself* when relevant
- **Hook** → the harness reacts to an event by running a shell command
- **Panel** → editor UI terminology (VS Code sidebar), *not* a Claude Code primitive
