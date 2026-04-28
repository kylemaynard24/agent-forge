// Retry + Timeout — wrap a flaky function so callers don't see the flakiness.
// Run: node demo.js

// A flaky downstream: succeeds 30% of the time, otherwise rejects.
// Occasionally it "hangs" — a promise that never resolves. The timeout saves us.
function flakyService(label) {
  return new Promise((resolve, reject) => {
    const roll = Math.random();
    if (roll < 0.05) return; // hang forever (5%)
    if (roll < 0.30) {
      setTimeout(() => resolve(`${label}: ok`), 20);
    } else {
      setTimeout(() => reject(new Error('transient blip')), 20);
    }
  });
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

// Exponential backoff with full jitter: wait random in [0, base * 2^attempt].
async function retry(fn, { maxAttempts = 5, baseMs = 50, timeoutMs = 100 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await withTimeout(fn(), timeoutMs);
    } catch (err) {
      lastErr = err;
      const cap = baseMs * 2 ** attempt;
      const wait = Math.floor(Math.random() * cap);
      console.log(`  attempt ${attempt + 1} failed (${err.message}); sleeping ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw new Error(`gave up after ${maxAttempts} attempts: ${lastErr.message}`);
}

async function main() {
  console.log('=== Retry + Timeout demo ===\n');

  // 1) Single naive call — likely to fail.
  console.log('Naive single call:');
  try {
    const r = await flakyService('naive');
    console.log('  ->', r);
  } catch (e) {
    console.log('  -> FAILED:', e.message);
  }

  // 2) Wrapped call — retries with jitter, bounded by timeout per attempt.
  console.log('\nWrapped call (5 attempts, 100ms timeout, exp backoff w/ jitter):');
  try {
    const r = await retry(() => flakyService('wrapped'), {
      maxAttempts: 5, baseMs: 50, timeoutMs: 100,
    });
    console.log('  ->', r);
  } catch (e) {
    console.log('  -> FAILED:', e.message);
  }

  // 3) Convergence: run 50 wrapped calls and report the success rate.
  console.log('\nConvergence — 50 wrapped calls:');
  let ok = 0, fail = 0;
  for (let i = 0; i < 50; i++) {
    try {
      await retry(() => flakyService(`r${i}`), { maxAttempts: 5, baseMs: 20, timeoutMs: 100 });
      ok++;
    } catch {
      fail++;
    }
  }
  console.log(`  succeeded: ${ok}/50   failed: ${fail}/50`);
  console.log('\nNote: per-call success was ~30%, but retry-with-jitter raises end-to-end success.');
}

main();
