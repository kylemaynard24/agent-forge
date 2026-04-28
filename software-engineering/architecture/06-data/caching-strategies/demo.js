// Caching strategies — cache-aside on top of a "slow" DB
// Run: node demo.js
// One process; "slow" simulated with setTimeout.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- The slow DB (source of truth) ---

const db = new Map([
  [1, { id: 1, name: 'Ada', email: 'ada@example.com' }],
  [2, { id: 2, name: 'Alan', email: 'alan@example.com' }],
]);

let dbReads = 0;
let dbWrites = 0;

async function dbGet(id) {
  dbReads++;
  await sleep(80); // pretend network/disk
  return db.get(id) ? { ...db.get(id) } : null;
}

async function dbPut(id, patch) {
  dbWrites++;
  await sleep(40);
  const cur = db.get(id);
  db.set(id, { ...cur, ...patch });
  return { ...db.get(id) };
}

// --- Cache (fast) ---

const cache = new Map();
let cacheHits = 0;
let cacheMisses = 0;

// --- Cache-aside read ---

async function getUser(id) {
  if (cache.has(id)) {
    cacheHits++;
    return cache.get(id);
  }
  cacheMisses++;
  const row = await dbGet(id);
  if (row) cache.set(id, row);
  return row;
}

// --- Write that invalidates ---

async function updateUser(id, patch) {
  const row = await dbPut(id, patch);
  cache.delete(id); // invalidate; next read repopulates
  return row;
}

// --- Demo ---

async function timed(label, fn) {
  const start = Date.now();
  const result = await fn();
  console.log(`  ${label.padEnd(28)} ${Date.now() - start}ms  ->`, result);
}

(async () => {
  console.log('=== Cache-aside demo ===\n');

  console.log('First read (cache miss, populates):');
  await timed('getUser(1)', () => getUser(1));

  console.log('\nSecond read (cache hit, fast):');
  await timed('getUser(1)', () => getUser(1));

  console.log('\nThird read, different key (miss):');
  await timed('getUser(2)', () => getUser(2));

  console.log('\nNow update user 1 — invalidates cache:');
  await timed('updateUser(1, ...)', () => updateUser(1, { email: 'ada@new.com' }));

  console.log('\nRead user 1 again — miss (we invalidated), repopulates:');
  await timed('getUser(1)', () => getUser(1));

  console.log('\nRead user 1 once more — hit:');
  await timed('getUser(1)', () => getUser(1));

  console.log('\nStats:');
  console.log(`  cache hits:   ${cacheHits}`);
  console.log(`  cache misses: ${cacheMisses}`);
  console.log(`  db reads:     ${dbReads}`);
  console.log(`  db writes:    ${dbWrites}`);
  console.log('\nNote: db reads == cache misses. That is the cache earning its keep.');
})();
