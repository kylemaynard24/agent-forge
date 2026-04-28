// Slash Commands — the "demo" is a real markdown file you'd save as
// .claude/commands/<name>.md.
//
// Run: node demo.js
//
// This script just prints the example to stdout so the topic has a runnable demo.

const example = `---
description: Summarize what changed on this branch.
allowed-tools: Bash
---

Inspect the current branch's diff against the main branch. Produce a structured
summary with three sections:

1. **What changed.** A bulleted list of file paths and a one-line description
   each. No more than 10 bullets.
2. **Why (best guess).** 2-3 sentences inferring the likely intent.
3. **Risks.** Any obvious issues that warrant a closer look (security, perf,
   breaking changes). Empty list if none.

Constraints:
- Use git commands only via the Bash tool.
- Do not modify any files.
- If the diff exceeds 1000 lines total, print the file list and stop; don't
  try to summarize a megapatch.
`;

console.log('=== Example slash command (.claude/commands/branch-summary.md) ===\n');
console.log(example);
console.log('\n=== Anatomy ===');
console.log('1. Frontmatter: description (shows in /help), allowed-tools.');
console.log('2. Body is plain markdown — instructions written for Claude.');
console.log('3. Numbered output structure: predictable shape every time.');
console.log('4. Constraints: explicit boundaries.');
console.log('5. A bail-out condition: don\'t try to summarize unmanageable diffs.');

console.log('\nTo install:');
console.log('  mkdir -p .claude/commands');
console.log('  cp this-file-content > .claude/commands/branch-summary.md');
console.log('  Then in Claude Code: /branch-summary');
