// Hooks — example settings.json snippet.
// Run: node demo.js

const example = {
  hooks: {
    PostToolUse: [
      {
        matcher: 'Edit|Write',
        hooks: [
          {
            type: 'command',
            command: 'test -f "$CLAUDE_FILE" && (prettier --write "$CLAUDE_FILE" 2>/dev/null || true)'
          }
        ]
      }
    ],
    PreToolUse: [
      {
        matcher: 'Edit|Write',
        hooks: [
          {
            type: 'command',
            command: 'case "$CLAUDE_FILE" in *.env|*secrets*|*credentials*) echo "BLOCKED: cannot edit secret file" >&2; exit 1;; esac'
          }
        ]
      }
    ],
    Stop: [
      {
        matcher: '*',
        hooks: [
          {
            type: 'command',
            command: 'command -v osascript >/dev/null && osascript -e \'display notification "Claude finished" with title "Claude Code"\' || true'
          }
        ]
      }
    ]
  }
};

console.log('=== Example settings.json hooks ===\n');
console.log(JSON.stringify(example, null, 2));

console.log('\n=== What each hook does ===');
console.log('1. PostToolUse + Edit|Write → prettier formats whatever Claude wrote.');
console.log('2. PreToolUse + Edit|Write → blocks edits to .env / secrets / credentials.');
console.log('3. Stop → fires a desktop notification when Claude finishes.');

console.log('\n=== To install ===');
console.log('Merge the hooks block into your .claude/settings.json (project) or');
console.log('~/.claude/settings.json (user). Restart Claude Code.');

console.log('\n=== Why these hooks vs prompts ===');
console.log('- "Format on edit" as a prompt = unreliable. Some edits, Claude forgets.');
console.log('  As a hook = always.');
console.log('- "Don\'t edit secrets" as a prompt = a polite suggestion. As a hook = a wall.');
console.log('- "Notify on stop" can\'t be a prompt at all — Claude can\'t see beyond its turn.');
