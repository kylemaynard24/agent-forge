#!/usr/bin/env bash
# PostToolUse hook — check homework.md files for clean code coverage.
#
# Fires after every Write call. Exits 0 silently for non-homework files.
# For homework.md files, checks that the content covers at least 3 of the 5
# clean code areas. If 3 or more are missing, emits a warning via stderr so
# Claude surfaces it to the user before moving on.
#
# Non-blocking: uses exit 1 (not exit 2), so no write is ever cancelled.
# The stderr output is captured as hook context that Claude can relay.

INPUT=$(cat)

# ── extract the file path from the JSON payload ─────────────────────────────
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null)

# Only care about homework.md files
if [[ "$FILE_PATH" != *"homework.md" ]]; then
  exit 0
fi

# File must exist on disk (it just got written)
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

CONTENT=$(cat "$FILE_PATH")
MISSING=()

# ── 5 clean code areas ───────────────────────────────────────────────────────

# 1. Naming and readability
if ! echo "$CONTENT" | grep -qiE \
  "nam(ing|e)|readab|clarity|descriptive|meaningful|intention.reveal|clear.*variable|clear.*function"; then
  MISSING+=("naming & readability")
fi

# 2. Single responsibility / small focused units
if ! echo "$CONTENT" | grep -qiE \
  "single.responsib|one.thing|small.function|focused|cohes|each.function|each.method|does.one"; then
  MISSING+=("single responsibility / small functions")
fi

# 3. DRY — avoid duplication
if ! echo "$CONTENT" | grep -qiE \
  '\bDRY\b|don.t repeat|duplicat|extract.*function|reuse|avoid.*repeat|abstract.*common'; then
  MISSING+=("DRY — avoid duplication")
fi

# 4. Separation of concerns / code structure
if ! echo "$CONTENT" | grep -qiE \
  "separat|structur|organiz|layer|boundar|module|concern|responsibi.*belong|where.*logic"; then
  MISSING+=("separation of concerns / structure")
fi

# 5. Comments and intent documentation
if ! echo "$CONTENT" | grep -qiE \
  "comment|intent|why.*code|explain.*decision|document|self.document|reveal.*intent"; then
  MISSING+=("comments & intent — explain the why, not the what")
fi

# ── report ───────────────────────────────────────────────────────────────────
if [ "${#MISSING[@]}" -gt 2 ]; then
  echo "" >&2
  echo "┌─ clean-code-check ──────────────────────────────────────────────" >&2
  echo "│  File : $FILE_PATH" >&2
  echo "│  Missing coverage (${#MISSING[@]}/5 areas):" >&2
  for area in "${MISSING[@]}"; do
    echo "│    • $area" >&2
  done
  echo "│" >&2
  echo "│  Consider adding at least one exercise or reflection question" >&2
  echo "│  for each missing area before this homework is final." >&2
  echo "└─────────────────────────────────────────────────────────────────" >&2
  exit 1
fi

exit 0
