// CAP / PACELC — simulate two replicas with replication and a partition.
// Run: node demo.js

class Replica {
  constructor(name) {
    this.name = name;
    this.store = new Map();
    this.peers = [];
  }

  connect(peer) { this.peers.push(peer); }

  // "Local" write: applies here, then async-replicates to peers if reachable.
  localWrite(key, value, { partitionedFrom = new Set() } = {}) {
    this.store.set(key, { value, version: Date.now() });
    for (const peer of this.peers) {
      if (partitionedFrom.has(peer.name)) continue;
      // Asynchronous replication
      setTimeout(() => peer.acceptReplica(key, this.store.get(key)), 5);
    }
  }

  // Synchronous quorum write: requires every peer to ack. If any is partitioned, the write fails.
  quorumWrite(key, value, { partitionedFrom = new Set() } = {}) {
    for (const peer of this.peers) {
      if (partitionedFrom.has(peer.name)) {
        return { ok: false, reason: 'partition — quorum unreachable' };
      }
    }
    this.store.set(key, { value, version: Date.now() });
    for (const peer of this.peers) peer.acceptReplica(key, this.store.get(key));
    return { ok: true };
  }

  acceptReplica(key, entry) {
    const cur = this.store.get(key);
    if (!cur || entry.version > cur.version) this.store.set(key, entry);
  }

  read(key) { return this.store.get(key)?.value ?? null; }
}

// Policies: how does a node respond to a read during a partition?
function readCP(replica, key, { partitionedFrom }) {
  // Refuse to serve if cannot confirm with peers — favor consistency.
  if (partitionedFrom.size > 0) {
    return { ok: false, reason: 'CP: cannot confirm freshness; refusing read' };
  }
  return { ok: true, value: replica.read(key) };
}

function readAP(replica, key, _ctx) {
  // Always answer with whatever local state we have — favor availability.
  return { ok: true, value: replica.read(key), maybeStale: true };
}

async function main() {
  console.log('=== CAP / PACELC demo ===\n');

  const A = new Replica('A');
  const B = new Replica('B');
  A.connect(B); B.connect(A);

  // Initial write replicates normally.
  A.localWrite('balance', 100);
  await new Promise((r) => setTimeout(r, 10));
  console.log('Before partition: B reads balance =', B.read('balance'));

  // ---- Partition: A and B can no longer talk ----
  const partitioned = new Set(['A', 'B']);
  console.log('\n*** NETWORK PARTITION ***');

  // A receives a write during the partition.
  A.localWrite('balance', 250, { partitionedFrom: new Set(['B']) });
  console.log('A took a write while partitioned. A reads:', A.read('balance'));
  console.log('B is unaware. B reads:', B.read('balance'), '(stale)');

  console.log('\n--- CAP: pick C or A on B during the partition ---');
  console.log('CP read on B:', readCP(B, 'balance', { partitionedFrom: new Set(['A']) }));
  console.log('AP read on B:', readAP(B, 'balance', { partitionedFrom: new Set(['A']) }));

  console.log('\n--- A quorum-write on A during the partition fails (chose C) ---');
  console.log(A.quorumWrite('balance', 999, { partitionedFrom: new Set(['B']) }));

  // ---- Heal partition ----
  console.log('\n*** PARTITION HEALED ***');
  // Replicate the held-back write
  for (const peer of A.peers) peer.acceptReplica('balance', A.store.get('balance'));
  console.log('B now reads:', B.read('balance'));

  console.log('\n--- PACELC ELSE: no partition, still trade off L vs C ---');
  // Latency-favoring async write returns immediately; consistency-favoring waits for quorum ack.
  const t0 = Date.now();
  A.localWrite('product', 'fast', { partitionedFrom: new Set() });
  console.log(`async (EL): write returned in ${Date.now() - t0}ms (B may be briefly stale)`);
  const t1 = Date.now();
  const r = A.quorumWrite('product', 'safe');
  console.log(`quorum (EC): write returned in ${Date.now() - t1}ms, ok=${r.ok}`);

  console.log('\nTake-away: there is no third option. Pick deliberately, document it, and tell product.');
}

main();
