// Bulkhead — isolated work pools per tenant.
// Run: node demo.js

class Pool {
  constructor(name, size) {
    this.name = name;
    this.size = size;
    this.inFlight = 0;
    this.queue = [];
  }

  submit(task) {
    return new Promise((resolve, reject) => {
      const job = { task, resolve, reject };
      if (this.inFlight < this.size) this.#run(job);
      else this.queue.push(job);
    });
  }

  #run(job) {
    this.inFlight += 1;
    Promise.resolve()
      .then(job.task)
      .then(
        (v) => { job.resolve(v); this.#release(); },
        (e) => { job.reject(e); this.#release(); },
      );
  }

  #release() {
    this.inFlight -= 1;
    const next = this.queue.shift();
    if (next) this.#run(next);
  }
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function task(label, ms) {
  return async () => {
    const start = Date.now();
    await sleep(ms);
    return { label, latencyMs: Date.now() - start };
  };
}

async function main() {
  console.log('=== Bulkhead demo ===\n');

  const poolA = new Pool('tenant-A', 2);
  const poolB = new Pool('tenant-B', 2);

  // Tenant A floods with 10 slow jobs (200ms each).
  // Tenant B has 3 fast jobs (20ms each), submitted at the same time.
  const start = Date.now();
  const aJobs = [];
  for (let i = 0; i < 10; i++) aJobs.push(poolA.submit(task(`A${i}`, 200)));
  const bJobs = [];
  for (let i = 0; i < 3; i++) bJobs.push(poolB.submit(task(`B${i}`, 20)));

  const bResults = await Promise.all(bJobs);
  const bDoneAt = Date.now() - start;
  console.log('Tenant B finished at t+%dms', bDoneAt);
  for (const r of bResults) console.log('  ', r.label, 'latency=', r.latencyMs, 'ms');

  const aResults = await Promise.all(aJobs);
  const aDoneAt = Date.now() - start;
  console.log('\nTenant A finished at t+%dms', aDoneAt);
  for (const r of aResults) console.log('  ', r.label, 'latency=', r.latencyMs, 'ms');

  console.log('\n--- Contrast: shared pool of size 2 (no bulkhead) ---\n');
  const shared = new Pool('shared', 2);
  const start2 = Date.now();
  const aJobs2 = [];
  for (let i = 0; i < 10; i++) aJobs2.push(shared.submit(task(`A${i}`, 200)));
  const bJobs2 = [];
  for (let i = 0; i < 3; i++) bJobs2.push(shared.submit(task(`B${i}`, 20)));

  const bRes2 = await Promise.all(bJobs2);
  console.log('Tenant B finished at t+%dms (shared pool)', Date.now() - start2);
  for (const r of bRes2) console.log('  ', r.label, 'latency=', r.latencyMs, 'ms');

  await Promise.all(aJobs2);
  console.log('\nNote: with bulkheads, B is unaffected. In a shared pool, B waits behind A.');
}

main();
