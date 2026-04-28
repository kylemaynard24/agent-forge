# Hook demo — guard against `rm -rf`

A `PreToolUse` hook that blocks any `rm -rf` targeting a path outside `/tmp` or `/var/folders`. The point isn't just safety — it's to show the shape of a working hook you can adapt.

## Files

- `guard-rm.sh` — the actual hook. Reads the event JSON on stdin, parses the Bash command, exits `2` to block.
- `settings-snippet.json` — the `settings.json` fragment that wires the hook into `PreToolUse` / `Bash`.

## Install (project scope — this repo only)

1. Merge the `hooks` block from `settings-snippet.json` into `.claude/settings.json` (create the file if missing).
2. Make the script executable:
   ```bash
   chmod +x examples/hooks/guard-rm.sh
   ```
3. Restart Claude Code in this repo. The hook fires on any Bash tool call.

## Install (user scope — every project)

1. Copy the script out of this repo:
   ```bash
   mkdir -p ~/.claude/hooks
   cp examples/hooks/guard-rm.sh ~/.claude/hooks/guard-rm.sh
   chmod +x ~/.claude/hooks/guard-rm.sh
   ```
2. Merge the snippet into `~/.claude/settings.json`, changing the command path to the absolute path:
   ```json
   "command": "bash $HOME/.claude/hooks/guard-rm.sh"
   ```

## Test

From Claude Code:

> "Run `rm -rf /tmp/foo`"

Should run normally.

> "Run `rm -rf ~/Desktop/foo`"

Should be blocked — Claude will see the hook's stderr and stop.

## Uninstall

Delete the `PreToolUse` entry from `settings.json`. The script file is harmless to leave in place.

## Reading the hook

The important parts:

- `jq -r '.tool_input.command // ""'` — the harness provides the tool's input as a JSON field. Extract the command.
- The regex matches `rm` with recursive+force flags in any order.
- The allow-list check looks for `/tmp/` or `/var/folders/` in the command.
- `exit 2` with a message on stderr = "block with reason X." `exit 0` = "allow."

## Adapting

Common extensions:

- **Warn instead of block:** `exit 0` but still `echo` to stderr (shows up as a non-blocking note).
- **Block force-pushes:** same pattern, matcher `"Bash"`, regex for `git push.*--force`.
- **Block editing certain files:** different matcher (`"Edit|Write"`), parse `tool_input.file_path`.
- **Run formatters after edits:** use `PostToolUse` with matcher `"Edit|Write"`, no block needed.

See [../../docs/hooks.md](../../docs/hooks.md) for the event catalog.

## What this hook teaches beyond the script itself

The conceptual lesson is that hooks are not just automation glue; they are **policy at the boundary of action**. A hook lets you insert organizational judgment exactly where raw tool power would otherwise be too permissive. In practice, that means hooks are most valuable when they encode safety, compliance, guardrails, or post-action hygiene that should be applied consistently rather than remembered ad hoc.

This is also why hook design should stay narrow. A small, legible policy is easier to trust than a clever hook that silently rewrites behavior in ten different cases.

## Questions to ask when adapting this pattern

- What event is the right enforcement point: before the action, after it, or at conversation stop?
- Should this policy block, warn, or annotate?
- Is the rule simple enough that a teammate could predict when it will fire?
- If the hook fails, is the failure mode acceptably safe?
