// Dependency Inversion — high-level depends on abstractions, not concrete vendors.
// Run: node demo.js

// === The abstraction (lives near the policy that needs it) ===
// Contract:
//   charge(amount, currency, token) -> Promise<{ ok, txId, reason? }>

// === High-level policy ===
class OrderProcessor {
  constructor(gateway) { this.gateway = gateway; }

  async submit(order) {
    if (order.amount <= 0) return { ok: false, reason: 'invalid amount' };
    const result = await this.gateway.charge(order.amount, order.currency, order.token);
    if (!result.ok) return { ok: false, reason: `payment failed: ${result.reason}` };
    return { ok: true, txId: result.txId };
  }
}

// === Two implementations of the abstraction ===

class FakeGateway {
  async charge(amount, currency, token) {
    console.log(`[fake] charge ${amount}${currency} token=${token}`);
    return { ok: true, txId: 'fake-' + Math.random().toString(36).slice(2, 8) };
  }
}

class StripeLikeGateway {
  async charge(amount, currency, token) {
    console.log(`[stripe-like] POST /v1/charges amount=${amount} currency=${currency.toLowerCase()}`);
    if (token === 'BAD') return { ok: false, reason: 'card_declined' };
    return { ok: true, txId: 'ch_' + Math.random().toString(36).slice(2, 10) };
  }
}

// === Demo ===
//
// OrderProcessor is identical. Only wiring changes.
// Tests can use FakeGateway with no network. Production uses Stripe-like.
// Switching to Adyen: write an AdyenGateway. OrderProcessor doesn't change.

(async () => {
  const order = { amount: 50, currency: 'USD', token: 'tok_visa' };

  console.log('--- Policy with fake gateway (test) ---');
  console.log(await new OrderProcessor(new FakeGateway()).submit(order));

  console.log('\n--- Same policy with Stripe-like gateway (prod) ---');
  console.log(await new OrderProcessor(new StripeLikeGateway()).submit(order));

  console.log('\n--- Same policy, declined card ---');
  console.log(await new OrderProcessor(new StripeLikeGateway()).submit({ ...order, token: 'BAD' }));
})();
