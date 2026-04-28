// Rate Limiting — Token Bucket.
// Run: node demo.js

class TokenBucket {
  constructor({ capacity, refillPerSecond }) {
    this.capacity = capacity;
    this.refillPerSecond = refillPerSecond;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  #refill() {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    const add = elapsedSec * this.refillPerSecond;
    this.tokens = Math.min(this.capacity, this.tokens + add);
    this.lastRefill = now;
  }

  tryTake(n = 1) {
    this.#refill();
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }

  inspect() {
    this.#refill();
    return Math.floor(this.tokens * 100) / 100;
  }
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  console.log('=== Rate Limiting (token bucket, 5 rps, burst 5) demo ===\n');

  const bucket = new TokenBucket({ capacity: 5, refillPerSecond: 5 });

  console.log('Phase 1: burst of 12 requests at once');
  for (let i = 1; i <= 12; i++) {
    const ok = bucket.tryTake();
    console.log(`  req ${String(i).padStart(2)} ${ok ? 'ADMIT' : 'REJECT'}  tokens=${bucket.inspect()}`);
  }

  console.log('\nPhase 2: steady 1 req every 150ms for 2 seconds');
  const start = Date.now();
  let admitted = 0, rejected = 0, n = 0;
  while (Date.now() - start < 2000) {
    n += 1;
    const ok = bucket.tryTake();
    ok ? admitted++ : rejected++;
    console.log(`  t+${String(Date.now() - start).padStart(4)}ms  req ${String(n).padStart(2)} ${ok ? 'ADMIT' : 'REJECT'}  tokens=${bucket.inspect()}`);
    await sleep(150);
  }
  console.log(`\nSteady-state: admitted=${admitted}, rejected=${rejected}`);
  console.log('At 1/0.15 = ~6.67 rps offered against 5 rps cap, ~25% rejection is expected.');

  console.log('\nPhase 3: idle for 1.5s, then fire 6 — bucket refills to capacity, then drains.');
  await sleep(1500);
  for (let i = 1; i <= 6; i++) {
    const ok = bucket.tryTake();
    console.log(`  req ${i} ${ok ? 'ADMIT' : 'REJECT'}  tokens=${bucket.inspect()}`);
  }
}

main();
