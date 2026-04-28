// Read replicas (with lag) + sharding (by key hash)
// Run: node demo.js
// All "nodes" live in the same process; lag is simulated with setTimeout.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Part 1: writer + read replicas with lag ---

class WriterDB {
  rows = new Map();
  replicas = [];

  async write(key, value) {
    this.rows.set(key, value);
    // Async replication: each replica catches up after a delay.
    for (const r of this.replicas) {
      setTimeout(() => r.rows.set(key, value), r.lagMs);
    }
  }

  read(key) {
    return this.rows.get(key);
  }
}

class ReplicaDB {
  rows = new Map();
  constructor(name, lagMs) {
    this.name = name;
    this.lagMs = lagMs;
  }
  read(key) {
    return this.rows.get(key);
  }
}

// --- Part 2: sharded keyspace ---

function hash(s) {
  let h = 0;
  for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

class Shard {
  rows = new Map();
  constructor(id) {
    this.id = id;
  }
  write(key, value) {
    this.rows.set(key, value);
  }
  read(key) {
    return this.rows.get(key);
  }
}

class Router {
  constructor(shards) {
    this.shards = shards;
  }
  shardFor(key) {
    return this.shards[hash(key) % this.shards.length];
  }
  write(key, value) {
    const s = this.shardFor(key);
    s.write(key, value);
    return s.id;
  }
  read(key) {
    return this.shardFor(key).read(key);
  }
}

// --- Demo ---

(async () => {
  console.log('=== Read replicas (with lag) ===\n');

  const writer = new WriterDB();
  const r1 = new ReplicaDB('replica-A', 50);
  const r2 = new ReplicaDB('replica-B', 200);
  writer.replicas = [r1, r2];

  await writer.write('user:1', { name: 'Ada', v: 1 });
  console.log('Immediately after write:');
  console.log('  writer    ->', writer.read('user:1'));
  console.log('  replica-A ->', r1.read('user:1'), '   (lag 50ms — STALE)');
  console.log('  replica-B ->', r2.read('user:1'), '   (lag 200ms — STALE)');

  await sleep(75);
  console.log('\nAfter 75ms:');
  console.log('  replica-A ->', r1.read('user:1'), '  (caught up)');
  console.log('  replica-B ->', r2.read('user:1'), '   (still stale)');

  await sleep(150);
  console.log('\nAfter another 150ms:');
  console.log('  replica-B ->', r2.read('user:1'), '  (caught up)');

  console.log('\n=== Sharding (hash routing) ===\n');

  const shards = [new Shard('shard-0'), new Shard('shard-1')];
  const router = new Router(shards);

  const keys = ['user:1', 'user:2', 'user:3', 'user:4', 'user:5', 'user:6'];
  for (const k of keys) {
    const s = router.write(k, { key: k });
    console.log(`  ${k}  hash%2=${hash(k) % 2}  ->  ${s}`);
  }

  console.log('\nShard contents:');
  for (const s of shards) console.log(`  ${s.id}: ${[...s.rows.keys()].join(', ')}`);

  console.log('\nReads route to the same shard the key was written to.');
  console.log('Cross-shard queries (e.g. "list all users") would require fan-out.');
})();
