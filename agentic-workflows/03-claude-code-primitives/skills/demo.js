// Skills — example skill file you'd save under .claude/skills/<name>/SKILL.md.
// Run: node demo.js

const example = `---
name: commit-message-policy
description: Whenever the user is about to commit, ensure the message follows
  the project's policy: subject under 70 chars, imperative mood, body wraps at
  80, and includes a "why" line. Trigger when intent is committing.
---

# Commit Message Policy

When the user signals they're about to commit (e.g., "commit this", "make a
commit", "save this work"), enforce this policy:

## Subject line
- Under 70 characters.
- Imperative mood ("add foo", not "added foo").
- Lowercase except for proper nouns.

## Body
- Wrap at 80 characters.
- Include a "why" line — a one-sentence explanation of motivation.
- No "Co-Authored-By:" lines unless the user explicitly asks.

## Pre-commit checklist
Before creating the commit:
1. Read the current diff with \`git diff --cached\`.
2. Confirm the subject describes WHAT changed (not how).
3. Confirm the body answers WHY it changed.
4. If the diff has unrelated changes, suggest splitting before committing.

## When NOT to apply
- The user passes their own message verbatim.
- It's a "wip" commit explicitly marked as scratch.
- The user is rebasing or amending (different rules apply).
`;

console.log('=== Example skill file (.claude/skills/commit-message-policy/SKILL.md) ===\n');
console.log(example);

console.log('\n=== Anatomy ===');
console.log('1. Frontmatter: name + description (the trigger criterion).');
console.log('2. Description tells Claude WHEN this skill applies — be specific.');
console.log('3. Body has constraints, checklist, and an explicit "when NOT" section.');
console.log('4. Skills are modular: they activate automatically when relevant.');

console.log('\nTo install:');
console.log('  mkdir -p .claude/skills/commit-message-policy');
console.log('  Save the markdown above as .claude/skills/commit-message-policy/SKILL.md');
console.log('  Now Claude will apply this skill whenever the user is about to commit.');

console.log('\nVs slash command:');
console.log('  - A /commit slash command runs ONCE when invoked.');
console.log('  - This SKILL applies whenever the *intent* is commit-related.');
