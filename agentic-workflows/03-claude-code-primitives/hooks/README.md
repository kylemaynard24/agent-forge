# Hooks

**Category:** Claude Code primitives

## What they are

A **hook** is a shell command run by the harness in response to an event. Hooks let you bolt automation onto agentic events you don't write code for: "before tool use," "after stop," "on user prompt," etc.

They live in your `settings.json` (project or user) under the `hooks` field:

```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "prettier --write $CLAUDE_FILE" }] }
    ]
  }
}
```

After Claude edits or writes a file, the harness runs `prettier --write` on it. The hook turns Claude's edits into formatted edits.

## Why hooks exist

Memory and prompts are not enough. Some behaviors must run **deterministically**, regardless of what the model is "feeling" today:

- Reformat after every edit.
- Lint before every commit.
- Block edits to certain files.
- Notify you when Claude finishes a long-running task.
- Auto-add a header to every new file.

Memory says "from now on, format my code." A hook *runs the formatter*. The hook is the harness; the harness is reliable.

## Common hook events

The exact set of supported events is harness-defined; common ones include:

- `PostToolUse` — after Claude uses a tool. Useful for "after every Edit, run the linter."
- `PreToolUse` — before Claude uses a tool. Useful for "before any Bash command, log it."
- `UserPromptSubmit` — when the user submits a prompt. Useful for adding context.
- `Stop` — when Claude finishes a turn. Useful for desktop notifications.
- `OnError` — when something fails. Useful for incident logging.

Each hook can have a `matcher` (which tools/events match) and one or more shell commands.

## Anatomy

```json
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<regex matching tool name or other criteria>",
        "hooks": [
          {
            "type": "command",
            "command": "<shell command, with $CLAUDE_* vars available>"
          }
        ]
      }
    ]
  }
}
```

## Examples

### Format after Edit/Write
```json
"PostToolUse": [
  { "matcher": "Edit|Write",
    "hooks": [{ "type": "command", "command": "test -f $CLAUDE_FILE && prettier --write $CLAUDE_FILE" }] }
]
```

### Block edits to `.env`
```json
"PreToolUse": [
  { "matcher": "Edit|Write",
    "hooks": [{ "type": "command",
                "command": "case \"$CLAUDE_FILE\" in *.env|*secrets*) echo BLOCKED; exit 1;; esac" }] }
]
```
Returning a non-zero exit code blocks the action.

### Notify on stop
```json
"Stop": [
  { "matcher": "*",
    "hooks": [{ "type": "command",
                "command": "osascript -e 'display notification \"Claude finished\" with title \"Claude Code\"'" }] }
]
```

## Hooks vs prompts vs memory

These three live in different layers:

| | Prompts (system prompt, skills) | Memory | Hooks |
|---|---|---|---|
| Who runs it | Claude (the model) | Claude (when it queries) | The harness |
| Reliability | Probabilistic | Probabilistic | Deterministic |
| When | Mid-prompt | Mid-prompt | At specific events |
| Best for | Behavior, decisions | Persistent facts | Side effects, validations, blocks |

**If a behavior MUST happen no matter what the LLM decides, use a hook.** If it should usually happen but the model has discretion, use a skill or system prompt.

This is the most useful distinction. Memory says "remember to format." A skill says "format before committing." A hook says "format. Period. Every time."

## Anti-patterns

- **Hooks for things prompts handle better.** Reaching for hooks when a skill would do — you've added complexity for no reliability gain.
- **Long-running hooks.** A hook that takes 30 seconds blocks every tool call. Keep them fast.
- **Hooks that change state silently.** A hook that auto-modifies files Claude just wrote — Claude's mental model of the file is now wrong.
- **Hooks with no error handling.** A hook that fails on every call cripples the harness.

## Trade-offs

**Pros**
- Deterministic — fires every time.
- Independent of model behavior.
- Off-the-LLM-path — no token cost for what hooks do.

**Cons**
- Adds latency to tool calls.
- Failure mode is "your harness is acting weird" — confusing to debug.
- Can fight prompts (Claude tries to write something; the hook blocks; Claude doesn't know why).

**Rule of thumb:** Use hooks when reliability matters more than flexibility. The classic case is **policy enforcement**: "never edit secrets" should be a hook, not a prompt instruction.

## Real-world analogies

- Git pre-commit hooks. Same idea: deterministic side effect at a specific event.
- A bouncer at a club checking IDs. Doesn't matter how charming the patron is.
- An IDE save action that auto-formats. The editor enforces.

## Run the demo

```bash
cat ./demo/example-settings.json
```

The demo is a real `settings.json` snippet showing three hooks: format on edit, block .env edits, notify on stop. You can drop these into your settings.
