#!/usr/bin/env bash
# PreToolUse hook for Bash — blocks `rm -rf` outside /tmp and /var/folders.
# The harness pipes the event as JSON on stdin and inspects the exit code:
#   exit 0  → allow the tool call
#   exit 2  → block the tool call; stderr is shown to the model

set -eu

input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // ""')

# Match rm with recursive+force flags in any order (-rf, -fr, -R -f, --recursive --force, ...)
if echo "$cmd" | grep -qE 'rm[[:space:]]+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r|--recursive.*--force|--force.*--recursive)'; then
  # Allow only if the target path is clearly inside /tmp or /var/folders (a macOS temp root)
  if ! echo "$cmd" | grep -qE '(^|[[:space:]])(/tmp/|/var/folders/)'; then
    echo "Blocked by guard-rm: recursive rm outside /tmp requires manual approval." >&2
    echo "Command: $cmd" >&2
    exit 2
  fi
fi
exit 0
