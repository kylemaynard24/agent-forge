# Hooks

A **hook** is a shell command the harness runs in response to an event — before a tool call, after an edit, when the session stops, etc. Hooks are how you make Claude Code *do* something reliably, not just *hope* it will.

## The key distinction

- **Memory / preferences** = you *ask* the model to behave a way. It might drift.
- **Hooks** = the harness *enforces* a behavior. The model can't opt out.

Anything like "every time X happens, do Y" should be a hook, not a reminder. Examples:
- Run the formatter after every file edit
- Block any `rm -rf` outside `/tmp`
- Notify Slack when a long task finishes
- Run tests before committing

## Where hooks are configured

In `settings.json` (user or project), under `hooks`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_FILE_PATHS\" 2>/dev/null || true"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/guard-rm.sh"
          }
        ]
      }
    ]
  }
}
```

## Event types

| Event | When it fires |
| --- | --- |
| `PreToolUse` | Before any tool call. Can approve/deny. |
| `PostToolUse` | After a tool call succeeds. Can't block, but can react. |
| `UserPromptSubmit` | When the user sends a message. Can inject context or block. |
| `Stop` | When Claude finishes responding. |
| `SubagentStop` | When a subagent finishes. |
| `Notification` | When Claude would notify you (idle, needs input). |
| `PreCompact` | Before the harness compacts context. |
| `SessionStart` / `SessionEnd` | Session lifecycle. |

Each entry can have a `matcher` (regex against tool name for tool events, or empty for all).

## How hook return values work

Hooks are shell commands. The harness inspects their **exit code** and **stderr**:

- Exit `0` → proceed normally
- Exit `2` → **block** the action; stderr is shown to the model as the reason
- Any other non-zero exit → non-blocking failure; stderr logged

For `PreToolUse`, exit 2 cancels the tool call. For `UserPromptSubmit`, exit 2 prevents submission.

Hooks also receive a JSON payload on stdin describing the event (tool name, file paths, etc.). Parse it if you need it.

## A practical starter: guard destructive bash

`.claude/hooks/guard-rm.sh`:

```bash
#!/usr/bin/env bash
# Block rm -rf outside /tmp
input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // ""')

if echo "$cmd" | grep -qE 'rm\s+-[a-z]*r[a-z]*f'; then
  if ! echo "$cmd" | grep -qE '(/tmp/|/var/folders/)'; then
    echo "Blocked: rm -rf outside /tmp requires explicit user approval." >&2
    exit 2
  fi
fi
exit 0
```

Make it executable: `chmod +x .claude/hooks/guard-rm.sh`.

Wire it up in `settings.json` under `PreToolUse` → `Bash`.

## Another starter: auto-format on edit

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "for f in $CLAUDE_FILE_PATHS; do case \"$f\" in *.ts|*.tsx|*.js|*.jsx) prettier --write \"$f\" ;; *.py) ruff format \"$f\" ;; esac; done"
          }
        ]
      }
    ]
  }
}
```

Claude edits the file, the hook formats it, you don't have to nag the model about formatting.

## User-scope vs. project-scope hooks

- `~/.claude/settings.json` — personal, applies everywhere
- `<repo>/.claude/settings.json` — project, checked in, shared with the team
- `<repo>/.claude/settings.local.json` — personal overrides for this project, gitignored

**Security note:** project hooks execute commands *on your machine* when you open the repo. Be cautious cloning untrusted repos — review their `.claude/settings.json` before running Claude Code against them.

## When to reach for a hook

- The behavior must be **reliable** — you can't tolerate the model forgetting
- It's a **cross-cutting** concern (formatting, guardrails, notifications) that shouldn't pollute prompts
- The action is **deterministic** — a shell command is enough

When the behavior needs judgment ("review this like a security expert"), use an agent or skill, not a hook.

## Gotchas

- **Hooks run on every matching event.** Slow hooks slow down every session. Keep them fast or run them async.
- **`exit 2` is a hard block.** Easy to footgun yourself — test guards thoroughly or you'll lock out useful tool calls.
- **stdin is JSON.** Parse with `jq`, not string matching, for anything non-trivial.
- **Hooks don't fire inside agents by default for every event.** Check the docs if you need subagent-scoped behavior.

## Where to go next

- Packaging interactive workflows → [slash-commands.md](slash-commands.md)
- Auto-loaded knowledge → [skills.md](skills.md)
- The full settings reference → run `/config` in Claude Code or edit `settings.json` directly
