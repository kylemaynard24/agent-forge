// Cost and Latency Control — four runs, four levers, measured.
// Run: node demo.js

// Toy pricing: input $3/M tokens, output $15/M tokens (flagship)
//              input $1/M, output $5/M (mid-tier)
//              input $0.25/M, output $1.25/M (small)
const PRICES = {
  flagship: { in: 3, out: 15 },
  mid: { in: 1, out: 5 },
  small: { in: 0.25, out: 1.25 }
};

function cost(model, tokens_in, tokens_out, cached = false) {
  const p = PRICES[model];
  const effective_in = cached ? tokens_in * 0.1 : tokens_in;
  return (effective_in * p.in + tokens_out * p.out) / 1_000_000;
}

// === Run 1: Baseline — flagship for everything; serial; no cache ===
function run_baseline() {
  const calls = [
    { model: 'flagship', tokens_in: 5000, tokens_out: 200, ms: 2000 },
    { model: 'flagship', tokens_in: 5500, tokens_out: 250, ms: 2200 },
    { model: 'flagship', tokens_in: 6000, tokens_out: 200, ms: 2100 },
    { model: 'flagship', tokens_in: 6500, tokens_out: 800, ms: 2500 }   // synthesis
  ];
  const total_cost = calls.reduce((s, c) => s + cost(c.model, c.tokens_in, c.tokens_out), 0);
  const total_ms = calls.reduce((s, c) => s + c.ms, 0);
  return { name: 'baseline', total_cost, total_ms, calls: calls.length };
}

// === Run 2: With prompt caching ===
function run_cached() {
  const calls = [
    { model: 'flagship', tokens_in: 5000, tokens_out: 200, ms: 2000, cached: false },
    { model: 'flagship', tokens_in: 5500, tokens_out: 250, ms: 2200, cached: true },  // 4500 of these are cacheable
    { model: 'flagship', tokens_in: 6000, tokens_out: 200, ms: 2100, cached: true },
    { model: 'flagship', tokens_in: 6500, tokens_out: 800, ms: 2500, cached: true }
  ];
  const total_cost = calls.reduce((s, c) => s + cost(c.model, c.tokens_in, c.tokens_out, c.cached), 0);
  const total_ms = calls.reduce((s, c) => s + c.ms, 0);
  return { name: 'cached', total_cost, total_ms, calls: calls.length };
}

// === Run 3: Smaller models for workers ===
function run_smaller() {
  const calls = [
    { model: 'flagship', tokens_in: 5000, tokens_out: 200, ms: 2000, cached: false }, // orchestrator
    { model: 'small',    tokens_in: 5500, tokens_out: 250, ms: 600,  cached: true },
    { model: 'small',    tokens_in: 6000, tokens_out: 200, ms: 600,  cached: true },
    { model: 'flagship', tokens_in: 6500, tokens_out: 800, ms: 2500, cached: true }   // synthesis
  ];
  const total_cost = calls.reduce((s, c) => s + cost(c.model, c.tokens_in, c.tokens_out, c.cached), 0);
  const total_ms = calls.reduce((s, c) => s + c.ms, 0);
  return { name: 'smaller', total_cost, total_ms, calls: calls.length };
}

// === Run 4: Parallel + smaller + cached ===
function run_optimized() {
  const calls = [
    { model: 'flagship', tokens_in: 5000, tokens_out: 200, ms: 2000, cached: false },
    { model: 'small',    tokens_in: 5500, tokens_out: 250, ms: 600,  cached: true },
    { model: 'small',    tokens_in: 6000, tokens_out: 200, ms: 600,  cached: true },
    { model: 'flagship', tokens_in: 6500, tokens_out: 800, ms: 2500, cached: true }
  ];
  const total_cost = calls.reduce((s, c) => s + cost(c.model, c.tokens_in, c.tokens_out, c.cached), 0);
  // Parallel: workers run concurrently. Total = orch + max(workers) + synthesis
  const total_ms = calls[0].ms + Math.max(calls[1].ms, calls[2].ms) + calls[3].ms;
  return { name: 'optimized', total_cost, total_ms, calls: calls.length };
}

const runs = [run_baseline(), run_cached(), run_smaller(), run_optimized()];

console.log('Run             | Cost (USD)  | Latency (ms)');
console.log('----------------|-------------|--------------');
for (const r of runs) {
  console.log(`${r.name.padEnd(15)} | $${r.total_cost.toFixed(5).padStart(9)} | ${String(r.total_ms).padStart(11)}`);
}

console.log(`
Take note:
  - Caching alone: ~30-40% savings (much of the cost is input tokens).
  - Smaller workers: dramatic cost reduction; faster wall-clock for those calls.
  - Parallel + smaller + cached: best of all worlds.
  - In real usage, the optimizations stack — each is independent.
  - Always: measure first; pick the lever that buys the most.
`);
