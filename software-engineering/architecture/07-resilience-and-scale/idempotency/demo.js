// Idempotency — same-key requests return the same result without re-executing.
// Run: node demo.js

class IdempotencyStore {
  constructor() { this.entries = new Map(); }

  // Returns { state: 'NEW' | 'IN_PROGRESS' | 'DONE', value? }
  begin(key) {
    const existing = this.entries.get(key);
    if (!existing) {
      this.entries.set(key, { state: 'IN_PROGRESS' });
      return { state: 'NEW' };
    }
    return existing;
  }

  complete(key, value) {
    this.entries.set(key, { state: 'DONE', value });
  }

  fail(key) {
    // On failure, remove so a retry can re-attempt. (Real systems often
    // store the failure too — depends on whether the failure is retryable.)
    this.entries.delete(key);
  }
}

// Simulated payment processor — has real side effects we count.
class Processor {
  constructor() { this.charges = []; }

  _charge(amount, card) {
    const id = `ch_${this.charges.length + 1}`;
    const record = { id, amount, card, at: new Date().toISOString() };
    this.charges.push(record);
    return record;
  }
}

class PaymentService {
  constructor() {
    this.proc = new Processor();
    this.store = new IdempotencyStore();
  }

  async chargeCard({ key, amount, card }) {
    if (!key) throw new Error('idempotency key required');

    const status = this.store.begin(key);
    if (status.state === 'DONE') {
      console.log(`  [replay]   key=${key} -> returning cached charge`);
      return status.value;
    }
    if (status.state === 'IN_PROGRESS') {
      console.log(`  [conflict] key=${key} -> request still in flight`);
      throw new Error('request in progress; please retry');
    }

    try {
      const result = this.proc._charge(amount, card);
      this.store.complete(key, result);
      console.log(`  [new]      key=${key} -> charged ${result.id} for $${amount}`);
      return result;
    } catch (err) {
      this.store.fail(key);
      throw err;
    }
  }

  totalCharges() { return this.proc.charges.length; }
  amountTotal() { return this.proc.charges.reduce((s, c) => s + c.amount, 0); }
}

async function main() {
  console.log('=== Idempotency demo ===\n');
  const svc = new PaymentService();

  console.log('Client retries the same request 3 times due to a flaky network:');
  await svc.chargeCard({ key: 'order-42', amount: 75, card: '4242' });
  await svc.chargeCard({ key: 'order-42', amount: 75, card: '4242' });
  await svc.chargeCard({ key: 'order-42', amount: 75, card: '4242' });

  console.log('\nA different order goes through:');
  await svc.chargeCard({ key: 'order-43', amount: 19, card: '4242' });

  console.log('\nA *different amount* with the SAME key is a client bug — server returns the original.');
  const replay = await svc.chargeCard({ key: 'order-42', amount: 9999, card: '4242' });
  console.log(`  replayed amount=${replay.amount} (note: 9999 was ignored)\n`);

  console.log(`Total charges executed: ${svc.totalCharges()}`);
  console.log(`Total dollars charged:  $${svc.amountTotal()}`);
  console.log('\nWith no idempotency, the same retries would have charged the customer 3+ times.');
}

main();
