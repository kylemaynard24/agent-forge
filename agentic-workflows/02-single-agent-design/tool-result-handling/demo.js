// Tool Result Handling — four ways to observe the same call.
// Run: node demo.js

// A tool that returns a "list_users" result of varying size.
function listUsers(n) {
  if (n < 0) throw new Error('count must be non-negative');
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `user-${i + 1}`,
    email: `user${i + 1}@example.com`,
    bio: 'lorem ipsum dolor sit amet '.repeat(8)
  }));
}

// === Strategy 1: Raw ===
function observeRaw(result) {
  return JSON.stringify(result);
}

// === Strategy 2: Hard truncate ===
function observeHardTruncate(result, maxChars = 200) {
  const s = JSON.stringify(result);
  if (s.length <= maxChars) return s;
  return `${s.slice(0, maxChars)}... [truncated, original ${s.length} chars]`;
}

// === Strategy 3: Structural summary ===
function observeStructural(result) {
  if (!Array.isArray(result)) return JSON.stringify(result);
  return JSON.stringify({
    type: 'array',
    count: result.length,
    sample: result.slice(0, 2),
    note: result.length > 2
      ? `${result.length - 2} more items elided; call list_users with offset to see more`
      : null
  });
}

// === Strategy 4: Error-aware wrapper ===
function observe(toolName, fn) {
  try {
    const result = fn();
    return { ok: true, observation: observeStructural(result) };
  } catch (e) {
    return {
      ok: false,
      observation: `ERROR: ${toolName}: ${e.message}. Tip: review your input shape and try again.`
    };
  }
}

// === Demo ===

console.log('=== Strategy 1: Raw ===');
console.log(observeRaw(listUsers(20)).slice(0, 200), '... (entire blob would go to the LLM)\n');

console.log('=== Strategy 2: Hard truncate ===');
console.log(observeHardTruncate(listUsers(20)));
console.log();

console.log('=== Strategy 3: Structural summary ===');
console.log(observeStructural(listUsers(20)));
console.log();

console.log('=== Strategy 4: Error-aware wrapper, success ===');
console.log(observe('list_users', () => listUsers(3)));
console.log();

console.log('=== Strategy 4: Error-aware wrapper, failure ===');
console.log(observe('list_users', () => listUsers(-1)));

console.log(`
Lessons:
  1. Raw observation: 20 users with bios = thousands of chars. Each loop iteration adds them all.
  2. Hard truncate: bounded prompt cost; LLM sees first chunk + "ask for more" hint.
  3. Structural: minimal prompt cost; LLM sees shape and can plan.
  4. Error-aware: failures are unmistakable; the loop never crashes silently.
`);
