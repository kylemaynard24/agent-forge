// Circuit Breaker — three states: CLOSED, OPEN, HALF_OPEN.
// Run: node demo.js

const STATE = { CLOSED: 'CLOSED', OPEN: 'OPEN', HALF_OPEN: 'HALF_OPEN' };

class CircuitBreaker {
  constructor({ failureThreshold = 3, cooldownMs = 200 } = {}) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.state = STATE.CLOSED;
    this.failures = 0;
    this.openedAt = 0;
  }

  async call(fn) {
    if (this.state === STATE.OPEN) {
      if (Date.now() - this.openedAt >= this.cooldownMs) {
        this.#transition(STATE.HALF_OPEN);
      } else {
        throw new Error('circuit OPEN — failing fast');
      }
    }

    try {
      const result = await fn();
      this.#onSuccess();
      return result;
    } catch (err) {
      this.#onFailure();
      throw err;
    }
  }

  #onSuccess() {
    if (this.state === STATE.HALF_OPEN) {
      this.#transition(STATE.CLOSED);
    }
    this.failures = 0;
  }

  #onFailure() {
    this.failures += 1;
    if (this.state === STATE.HALF_OPEN || this.failures >= this.failureThreshold) {
      this.#transition(STATE.OPEN);
      this.openedAt = Date.now();
    }
  }

  #transition(next) {
    console.log(`  [breaker] ${this.state} -> ${next}`);
    this.state = next;
  }
}

// Simulated downstream: dies for a stretch, then recovers.
let healthy = true;
function downstream() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!healthy) reject(new Error('downstream is down'));
      else resolve('ok');
    }, 5);
  });
}

async function tick(label, breaker) {
  process.stdout.write(`${label.padEnd(8)} `);
  try {
    const r = await breaker.call(downstream);
    console.log('->', r, `(state=${breaker.state})`);
  } catch (e) {
    console.log('-> FAIL:', e.message, `(state=${breaker.state})`);
  }
}

async function main() {
  console.log('=== Circuit Breaker demo ===\n');
  const breaker = new CircuitBreaker({ failureThreshold: 3, cooldownMs: 200 });

  console.log('Phase 1: downstream is healthy.');
  for (let i = 1; i <= 2; i++) await tick(`call ${i}`, breaker);

  console.log('\nPhase 2: downstream goes down — breaker should open after 3 failures.');
  healthy = false;
  for (let i = 3; i <= 7; i++) await tick(`call ${i}`, breaker);

  console.log('\nPhase 3: still down, but breaker is OPEN — calls fail fast (no downstream load).');
  for (let i = 8; i <= 10; i++) await tick(`call ${i}`, breaker);

  console.log('\nPhase 4: wait past cooldown, downstream recovers, breaker probes via HALF_OPEN.');
  await new Promise((r) => setTimeout(r, 220));
  healthy = true;
  for (let i = 11; i <= 13; i++) await tick(`call ${i}`, breaker);
}

main();
