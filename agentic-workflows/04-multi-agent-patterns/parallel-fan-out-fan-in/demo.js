// Parallel Fan-Out / Fan-In — bounded batching + aggregation.
// Run: node demo.js

async function worker(item) {
  // Stub: returns a "vote" with some randomness to simulate disagreement.
  await new Promise(r => setTimeout(r, 100 + Math.random() * 100));
  const verdicts = ['safe', 'safe', 'safe', 'unsafe'];   // 75/25 distribution
  return { item, verdict: verdicts[Math.floor(Math.random() * 4)] };
}

// === Bounded batched fan-out ===
async function batched(items, k, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += k) {
    const start = Date.now();
    const chunk = await Promise.all(items.slice(i, i + k).map(fn));
    out.push(...chunk);
    console.log(`  batch ${Math.floor(i / k) + 1}: ${chunk.length} items in ${Date.now() - start}ms`);
  }
  return out;
}

// === Aggregator: majority vote ===
function majorityVote(results) {
  const counts = {};
  for (const r of results) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;
  const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return { verdict: winner[0], counts, total: results.length };
}

(async () => {
  const items = ['file-1', 'file-2', 'file-3', 'file-4', 'file-5', 'file-6', 'file-7', 'file-8'];

  console.log(`Fan-out across ${items.length} items, batch size 3:`);
  const start = Date.now();
  const results = await batched(items, 3, worker);
  const wall = Date.now() - start;

  console.log(`\nTotal wall time: ${wall}ms`);
  console.log('Per-item results:', results);

  // Aggregation: same input, different "voters" — majority wins.
  // (In a real workflow, you'd run multiple workers on the SAME item to vote.)
  console.log('\nAggregation (majority vote):', majorityVote(results));

  console.log(`
Take note:
  - 8 items in ~3 batches of 3, 2 batches of 3 + 1 batch of 2.
  - Total wall ≈ 3 × per-batch time, NOT 8 × per-item time.
  - Aggregation here is voting — a real one might LLM-synthesize.
  - Batch size 3 is a balance: faster than serial; bounded against rate limits.
  - For the same-input-multiple-times case (sampling for consensus), use a worker
    pool of N samples on ONE input and aggregate.
`);
})();
