// Memory Patterns — file-backed memory across sessions.
// Run: node demo.js
//
// We use an in-memory Map as the "file" for portability. Replace with fs.* in production.

const persistentStore = new Map();   // pretend this is on disk

// === Memory tools ===
const memory = {
  save({ key, content }) {
    persistentStore.set(key, content);
    return `saved: ${key}`;
  },
  load({ key }) {
    return persistentStore.has(key)
      ? persistentStore.get(key)
      : `ERROR: no entry for "${key}"`;
  },
  list() {
    const keys = [...persistentStore.keys()];
    return keys.length ? keys.join(', ') : '(empty)';
  },
  search({ query }) {
    const matches = [];
    for (const [k, v] of persistentStore) {
      if (k.includes(query) || v.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ key: k, snippet: v.slice(0, 60) });
      }
    }
    return matches.length ? JSON.stringify(matches) : `(no matches for "${query}")`;
  }
};

// === Session 1: agent learns about Kyle ===
console.log('=== SESSION 1 ===\n');
console.log('agent: discovers user preferences and saves them');
console.log(memory.save({ key: 'pref:review-style',
                          content: 'Kyle prefers concise reviews; avoid verbose explanations.' }));
console.log(memory.save({ key: 'fact:owns:billing',
                          content: 'Kyle owns the billing service in the prod-1 cluster.' }));
console.log(memory.save({ key: 'pref:commit-msg',
                          content: 'Commit messages: short subject + bullet points; no emoji.' }));
console.log('\nagent: lists what it has');
console.log(memory.list());
console.log('\n=== END SESSION 1 ===\n');

// === Session 2: a fresh agent loop, but memory persists ===
console.log('=== SESSION 2 (fresh loop, persistent memory) ===\n');
console.log('user: write me a commit message for this change.\n');
console.log('agent: search memory for commit-style preferences');
const found = memory.search({ query: 'commit' });
console.log(`-> ${found}\n`);
console.log('agent: load the matching entry');
const pref = memory.load({ key: 'pref:commit-msg' });
console.log(`-> "${pref}"\n`);
console.log('agent: now writes the commit message following the preference');
console.log('       (would call an LLM here; we just print)');
console.log('       "fix billing rate limit\\n\\n- handle 429 retry\\n- add jitter"\n');
console.log('=== END SESSION 2 ===');

console.log(`
Take note:
  1. Session 2 has zero conversational memory of session 1, but the file-backed
     memory persists between them. The agent recovers context by *retrieving*.
  2. The agent decided WHAT to recall (it searched for "commit" relevance).
     We didn't auto-inject all preferences — that would bloat context.
  3. Each entry has a key. Keys make recall efficient. Free-text journals don't.
  4. In production: replace persistentStore with disk, a KV store, or a DB.
     The pattern doesn't change — only the storage backend.
`);
