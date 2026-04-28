// Load Balancing — round-robin vs least-connections.
// Run: node demo.js

class Backend {
  constructor(name) {
    this.name = name;
    this.inFlight = 0;
    this.totalHandled = 0;
    this.totalCostMs = 0;
  }

  handle(costMs) {
    this.inFlight += 1;
    this.totalHandled += 1;
    this.totalCostMs += costMs;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.inFlight -= 1;
        resolve();
      }, costMs);
    });
  }
}

class RoundRobin {
  constructor(backends) { this.backends = backends; this.i = 0; }
  pick() {
    const b = this.backends[this.i % this.backends.length];
    this.i += 1;
    return b;
  }
}

class LeastConnections {
  constructor(backends) { this.backends = backends; }
  pick() {
    let best = this.backends[0];
    for (const b of this.backends) if (b.inFlight < best.inFlight) best = b;
    return best;
  }
}

function makeRequests(n) {
  // Mix of cheap and expensive requests; "hot" requests every 7th call.
  const reqs = [];
  for (let i = 0; i < n; i++) {
    const expensive = i % 7 === 0;
    reqs.push({ id: i, costMs: expensive ? 60 : 8 });
  }
  return reqs;
}

async function run(strategyName, strategy, requests) {
  const start = Date.now();
  const inflight = [];
  for (const req of requests) {
    const b = strategy.pick();
    inflight.push(b.handle(req.costMs));
    // Small inter-arrival gap to allow least-connections to react.
    await new Promise((r) => setImmediate(r));
  }
  await Promise.all(inflight);
  const wall = Date.now() - start;

  console.log(`\n--- ${strategyName} ---`);
  console.log(`wall-clock to drain: ${wall}ms`);
  for (const b of strategy.backends) {
    console.log(`  ${b.name}: handled=${b.totalHandled.toString().padStart(3)}  totalCost=${b.totalCostMs}ms`);
  }
}

async function main() {
  console.log('=== Load Balancing demo (3 backends, 100 requests, mixed cost) ===');

  const rr = new RoundRobin([new Backend('rr-A'), new Backend('rr-B'), new Backend('rr-C')]);
  const lc = new LeastConnections([new Backend('lc-A'), new Backend('lc-B'), new Backend('lc-C')]);

  // Identical request stream for fair comparison.
  const reqs = makeRequests(100);

  await run('Round Robin', rr, reqs);
  await run('Least Connections', lc, reqs);

  console.log('\nObservation: round-robin distributes *count* evenly but not *work*.');
  console.log('Least-connections evens out *work* by avoiding queueing behind slow requests.');
}

main();
