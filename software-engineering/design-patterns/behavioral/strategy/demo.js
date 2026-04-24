// Strategy — checkout with interchangeable payment strategies
// Run: node demo.js

// --- Strategy interface ---

class PaymentStrategy {
  pay(_amountCents) { throw new Error('pay()'); }
}

// --- Concrete strategies ---

class CreditCardPayment extends PaymentStrategy {
  constructor(last4) { super(); this.last4 = last4; }
  pay(amountCents) {
    const dollars = (amountCents / 100).toFixed(2);
    console.log(`  [credit] charging $${dollars} to card ****${this.last4}`);
    return { method: 'credit', ref: `CC-${Date.now()}` };
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email) { super(); this.email = email; }
  pay(amountCents) {
    const dollars = (amountCents / 100).toFixed(2);
    console.log(`  [paypal] charging $${dollars} to ${this.email}`);
    return { method: 'paypal', ref: `PP-${Date.now()}` };
  }
}

class CryptoPayment extends PaymentStrategy {
  constructor(wallet) { super(); this.wallet = wallet; }
  pay(amountCents) {
    const btc = (amountCents / 1_000_000).toFixed(6); // toy rate
    console.log(`  [crypto] sending ${btc} BTC to ${this.wallet.slice(0, 8)}...`);
    return { method: 'crypto', ref: `BTC-${Date.now()}` };
  }
}

// --- Context ---

class Checkout {
  constructor(items) {
    this.items = items;
    this.strategy = null;
  }
  usePayment(strategy) {
    this.strategy = strategy;
    return this;
  }
  total() {
    return this.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
  }
  placeOrder() {
    if (!this.strategy) throw new Error('set a payment strategy first');
    const amount = this.total();
    console.log(`Placing order for $${(amount / 100).toFixed(2)}:`);
    const receipt = this.strategy.pay(amount);
    console.log(`  → ${receipt.method} ref ${receipt.ref}`);
    return receipt;
  }
}

// --- Demo ---

console.log('=== Strategy demo ===\n');

const cart = new Checkout([
  { name: 'book',  priceCents: 1999, qty: 2 },
  { name: 'mouse', priceCents: 2999, qty: 1 },
]);

cart.usePayment(new CreditCardPayment('4242'));
cart.placeOrder();

console.log();
cart.usePayment(new PayPalPayment('alice@example.com'));
cart.placeOrder();

console.log();
cart.usePayment(new CryptoPayment('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'));
cart.placeOrder();

console.log('\nKey idea: Checkout never knew which payment method it was using.');
console.log('Adding a new one (GooglePay) is a new class, no edits to Checkout.');
