# agent-forge docs

A working guide for building with Claude Code. Start at **getting-started**, then jump to whichever primitive you need.

## Contents

| File | What it covers |
| --- | --- |
| [getting-started.md](getting-started.md) | How Claude Code works, the core primitives, permission modes, the `.claude/` folder |
| [agents.md](agents.md) | Creating subagents — file format, when to use them, invocation patterns |
| [plans.md](plans.md) | Plan mode — how it works, when to use it, writing prompts that produce good plans |
| [panels.md](panels.md) | **Your term.** Multi-agent orchestration — coordinating several agents over one project |
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
- **Panel** → a pattern: one orchestrator agent fans out to several specialist agents
- **Slash command** → a named prompt template you type (`/foo`)
- **Skill** → a capability the model loads *itself* when relevant
- **Hook** → the harness reacts to an event by running a shell command
