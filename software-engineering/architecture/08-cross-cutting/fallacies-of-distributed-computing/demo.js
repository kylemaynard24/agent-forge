// Fallacies of Distributed Computing — naive vs correct client.
// Run: node demo.js

// Simulated unreliable network. Lossy, slow, narrow, and occasionally hostile.
function unreliableSend(payload, { sizeBytes = payload.length } = {}) {
  return new Promise((resolve, reject) => {
    // Fallacy 2 (latency): variable delay, sometimes large.
    const latency = Math.random() < 0.10 ? 800 : 50 + Math.random() * 100;

    // Fallacy 3 (bandwidth): big payloads degrade.
    if (sizeBytes > 1024) return setTimeout(() => reject(new Error('packet too large for this link')), latency);

    // Fallacy 1 (reliability): 25% drop rate, 5% hang forever.
    const roll = Math.random();
    if (roll < 0.05) return; // silent hang
    if (roll < 0.30) return setTimeout(() => reject(new Error('packet lost')), latency);

    // Fallacy 4 (security): occasional MITM rewrites payload.
    const delivered = Math.random() < 0.05 ? payload.toUpperCase() + '<TAMPERED>' : payload;

    setTimeout(() => resolve({ delivered, latency }), latency);
  });
}

// ---------- Naive client: assumes all 8 fallacies hold ----------
async function naiveClient(payload) {
  // No timeout (assumes reliable + zero-latency)
  // No retry (assumes reliable)
  // No size check (assumes infinite bandwidth)
  // No auth/HMAC (assumes secure network)
  // No fallback peer (assumes static topology, one admin, homogeneous)
  const reply = await unreliableSend(payload);
  return reply.delivered;
}

// ---------- Correct client: defends against the fallacies ----------
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); },
                  (e) => { clearTimeout(t); reject(e); });
  });
}

function hmac(payload) {
  // Pretend HMAC: sums char codes mod 256. Real systems use real crypto.
  let s = 0; for (const c of payload) s = (s + c.charCodeAt(0)) % 256;
  return s;
}

async function correctClient(payload, { peers = ['p1', 'p2'] } = {}) {
  // Fallacy 3: chunk if too large.
  if (payload.length > 1024) {
    const chunks = [];
    for (let i = 0; i < payload.length; i += 512) chunks.push(payload.slice(i, i + 512));
    const out = [];
    for (const c of chunks) out.push(await correctClient(c, { peers }));
    return out.join('');
  }

  // Fallacy 4: sign payload so we detect tampering.
  const sig = hmac(payload);

  // Fallacy 5/6/8: try peers in order; topology is not static.
  let lastErr;
  for (const peer of peers) {
    // Fallacy 1/2: bounded retries with timeout.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const reply = await withTimeout(unreliableSend(payload), 200);
        // Verify integrity (Fallacy 4).
        if (hmac(reply.delivered) !== sig) throw new Error('integrity check failed');
        return reply.delivered;
      } catch (e) {
        lastErr = e;
        const wait = Math.floor(Math.random() * (40 * 2 ** attempt));
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }
  throw new Error(`all peers failed: ${lastErr.message}`);
}

async function main() {
  console.log('=== Fallacies of Distributed Computing demo ===\n');

  console.log('--- Naive client: 10 calls ---');
  let nOk = 0, nFail = 0;
  for (let i = 0; i < 10; i++) {
    try {
      // Hard cap so the demo finishes even when the naive client hangs.
      const r = await withTimeout(naiveClient(`hello-${i}`), 1500);
      nOk++;
      console.log(`  call ${i}: ok -> ${r}`);
    } catch (e) {
      nFail++;
      console.log(`  call ${i}: FAIL -> ${e.message}`);
    }
  }
  console.log(`naive: ok=${nOk}, fail=${nFail}`);

  console.log('\n--- Correct client: 10 calls ---');
  let cOk = 0, cFail = 0;
  for (let i = 0; i < 10; i++) {
    try {
      await correctClient(`hello-${i}`);
      cOk++;
    } catch (e) {
      cFail++;
      console.log(`  call ${i}: FAIL -> ${e.message}`);
    }
  }
  console.log(`correct: ok=${cOk}, fail=${cFail}`);
  console.log('\nThe network was identical for both runs. Only the assumptions differed.');
}

main();
