// Orchestrator-Worker — fanned-out workers, synthesized.
// Run: node demo.js

// Each "worker" simulates an LLM call with realistic latency (200-400ms).
function worker(name, latencyMs, finding) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ name, finding }), latencyMs);
  });
}

// === Orchestrator ===
async function orchestrate(strategy = 'parallel') {
  const briefs = [
    { name: 'security', latency: 350, finding: 'no XSS or SQL injection found in diff' },
    { name: 'performance', latency: 250, finding: 'one N+1 query in users.py:42' },
    { name: 'readability', latency: 300, finding: 'three functions exceed 60 lines; consider splitting' }
  ];

  console.log(`\n=== Orchestrator: ${strategy} ===`);
  const start = Date.now();

  let results;
  if (strategy === 'parallel') {
    // Fire all workers concurrently.
    results = await Promise.all(briefs.map(b => worker(b.name, b.latency, b.finding)));
  } else {
    // Serial: each waits for the previous.
    results = [];
    for (const b of briefs) {
      results.push(await worker(b.name, b.latency, b.finding));
    }
  }

  const wall = Date.now() - start;

  // Synthesize: a real orchestrator would feed these back into an LLM.
  const synthesized = {
    summary: `${results.length} reviews complete. Highest-priority finding: ${results.find(r => r.name === 'performance').finding}`,
    reports: results
  };

  console.log(`Wall time: ${wall}ms`);
  console.log('Synthesized:', JSON.stringify(synthesized, null, 2));
}

(async () => {
  await orchestrate('parallel');
  await orchestrate('serial');

  console.log(`
Take note:
  - Parallel completes in ~max(latency) = ~350ms.
  - Serial completes in ~sum(latency) = ~900ms.
  - In Claude Code, multiple Agent calls in ONE message run in parallel.
    Multiple Agent calls in separate messages run serially.
  - Each worker has its own context, tools, system prompt.
  - Synthesis is its own (often LLM-based) step. Skipping it wastes the gains.
`);
})();
