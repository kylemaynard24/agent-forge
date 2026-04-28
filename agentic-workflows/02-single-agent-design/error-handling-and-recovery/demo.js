// Error Handling and Recovery — three strategies side-by-side.
// Run: node demo.js

// === A flaky tool: 50% transient, 30% application error, 20% success ===
let calls = 0;
function flakyFetch({ id }) {
  calls++;
  const r = Math.random();
  if (r < 0.5) {
    const e = new Error('connection reset');
    e.transient = true;
    throw e;
  }
  if (r < 0.8) return `ERROR: not_found: id=${id}`;
  return `success: { id: ${id}, name: "user-${id}" }`;
}

// Reset the counter helper
function reset() { calls = 0; }

// === Strategy 1: Ignore — crash on any error ===
function strategy1(id) {
  console.log('--- Strategy 1: Ignore ---');
  reset();
  try {
    const result = flakyFetch({ id });
    console.log(`got: ${result}, calls: ${calls}`);
  } catch (e) {
    console.log(`crashed: ${e.message}, calls: ${calls}`);
  }
}

// === Strategy 2: Retry only ===
async function withRetry(fn, attempts = 5, baseMs = 50) {
  for (let i = 0; i < attempts; i++) {
    try { return fn(); }
    catch (e) {
      if (!e.transient) throw e;
      await new Promise(r => setTimeout(r, baseMs * (i + 1)));
    }
  }
  throw new Error('all retries exhausted');
}

async function strategy2(id) {
  console.log('\n--- Strategy 2: Retry-only ---');
  reset();
  try {
    const result = await withRetry(() => flakyFetch({ id }));
    console.log(`got: ${result}, calls: ${calls}`);
  } catch (e) {
    console.log(`failed: ${e.message}, calls: ${calls}`);
  }
}

// === Strategy 3: Retry + surface non-transient errors to "LLM" (we just print) ===
async function strategy3(id) {
  console.log('\n--- Strategy 3: Retry + surface ---');
  reset();
  let lastObs;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const result = await withRetry(() => flakyFetch({ id }));
      if (result.startsWith('ERROR:')) {
        // Application error — surface to LLM (here, print and try a different id)
        lastObs = result;
        console.log(`obs: ${result} → LLM tries different id`);
        id += 100;            // pretend the LLM picked a new id
        continue;
      }
      console.log(`got: ${result}, calls: ${calls}`);
      return;
    } catch (e) {
      lastObs = `transient: all retries exhausted (${e.message})`;
      console.log(`obs: ${lastObs}`);
    }
  }
  console.log(`gave up after multiple attempts. last obs: ${lastObs}, calls: ${calls}`);
}

// === Run ===
(async () => {
  strategy1(1);
  await strategy2(1);
  await strategy3(1);

  console.log(`
Lessons:
  1. Strategy 1 (ignore): one bad call = whole agent crashes. Bad.
  2. Strategy 2 (retry-only): handles transient infra issues.
                              But application errors ("not found") cause hard fail.
  3. Strategy 3 (retry + surface): combines retry for infra + observation-as-input
                                   for app errors. The "agent" tries a different id.

In production, errors should almost always end up in front of the LLM as
observations. The LLM is great at picking next moves given good signals.
`);
})();
